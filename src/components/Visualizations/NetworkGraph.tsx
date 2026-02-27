import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { useOKR } from '../../context/OKRContext';
import { buildGraph } from '../../utils/linkAnalysis';
import { getTeamColor, hexToRgba } from '../../utils/colors';
import type { GraphNode, GraphLink } from '../../types/okr';

// Uniform sizes per hierarchy level — no connection bonus
const LEVEL_RADIUS = {
  org: 22,    // org-objective, org-kr
  team: 15,   // team-objective, team-kr
  individual: 10, // individual, individual-kr
} as const;

const LEVEL_STROKE_WIDTH = {
  org: 2.5,
  team: 2,
  individual: 1.5,
} as const;

function getNodeLevel(type: GraphNode['type']): 'org' | 'team' | 'individual' {
  if (type === 'org-objective' || type === 'org-kr') return 'org';
  if (type === 'team-objective' || type === 'team-kr') return 'team';
  return 'individual';
}

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const selectedNodeRef = useRef<string | null>(null);
  // Refs to D3 selections so a secondary effect can apply visuals on external state changes
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const nodeSelRef = useRef<any>(null);
  const linkSelRef = useRef<any>(null);
  const adjacencyRef = useRef<Map<string, Set<string>> | null>(null);
  const applySelectionVisualsRef = useRef<((id: string | null, animate: boolean) => void) | null>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const { state, dispatch } = useOKR();
  const { data, filters } = state;

  // Keep ref in sync so D3 closures always read the latest value
  selectedNodeRef.current = filters.selectedNodeId;

  const getNodeRadius = useCallback((node: GraphNode): number => {
    return LEVEL_RADIUS[getNodeLevel(node.type)];
  }, []);

  // Color based on team + connection intensity
  // maxConnections is passed at render time so it can adapt to the current dataset
  const getNodeFill = useCallback((node: GraphNode, maxConnections: number): string => {
    // Compute intensity: 0.25 (faintest) → 1.0 (fully solid)
    const intensity = maxConnections > 0
      ? 0.25 + 0.75 * (node.connectionCount / maxConnections)
      : 0.5;

    // Base hue: org nodes use accent blue, team/individual use team color
    let baseColor: string;
    if (node.type === 'org-objective' || node.type === 'org-kr') {
      baseColor = '#3B82F6'; // accent blue — visible against dark bg
    } else if (node.teamId) {
      baseColor = getTeamColor(node.teamId);
    } else {
      baseColor = '#94A3B8';
    }

    return hexToRgba(baseColor, intensity);
  }, []);

  const getNodeStroke = useCallback((node: GraphNode): string => {
    if (node.type === 'org-objective' || node.type === 'org-kr') return '#60A5FA'; // lighter blue for org stroke
    if (node.teamId) return getTeamColor(node.teamId);
    return '#64748B';
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const { nodes: rawNodes, links: rawLinks } = buildGraph(data);

    // Apply filters
    let filteredNodes = rawNodes;
    let filteredLinks = rawLinks;

    if (filters.selectedTeams.length > 0) {
      filteredNodes = rawNodes.filter(
        (n) =>
          !n.teamId ||
          filters.selectedTeams.includes(n.teamId) ||
          n.type === 'org-objective' ||
          n.type === 'org-kr'
      );
      const nodeIds = new Set(filteredNodes.map((n) => n.id));
      filteredLinks = rawLinks.filter(
        (l) => {
          const sId = typeof l.source === 'string' ? l.source : l.source.id;
          const tId = typeof l.target === 'string' ? l.target : l.target.id;
          return nodeIds.has(sId) && nodeIds.has(tId);
        }
      );
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchIds = new Set(
        filteredNodes.filter((n) => n.label.toLowerCase().includes(q)).map((n) => n.id)
      );
      // Also include connected nodes
      filteredLinks.forEach((l) => {
        const sId = typeof l.source === 'string' ? l.source : l.source.id;
        const tId = typeof l.target === 'string' ? l.target : l.target.id;
        if (matchIds.has(sId)) matchIds.add(tId);
        if (matchIds.has(tId)) matchIds.add(sId);
      });
      filteredNodes = filteredNodes.filter((n) => matchIds.has(n.id));
      const nodeIds = new Set(filteredNodes.map((n) => n.id));
      filteredLinks = filteredLinks.filter((l) => {
        const sId = typeof l.source === 'string' ? l.source : l.source.id;
        const tId = typeof l.target === 'string' ? l.target : l.target.id;
        return nodeIds.has(sId) && nodeIds.has(tId);
      });
    }

    // Deep copy for D3 mutation
    const nodes: GraphNode[] = filteredNodes.map((n) => ({ ...n }));
    const links: GraphLink[] = filteredLinks.map((l) => ({
      source: typeof l.source === 'string' ? l.source : l.source.id,
      target: typeof l.target === 'string' ? l.target : l.target.id,
      type: l.type,
      relationship: l.relationship,
    }));

    // Compute max connection count for color intensity scaling
    const maxConnections = Math.max(1, ...nodes.map((n) => n.connectionCount));

    // Precompute adjacency map for fast neighbor lookups (used by hover)
    const adjacency = new Map<string, Set<string>>();
    for (const l of links) {
      const sId = typeof l.source === 'string' ? l.source : l.source.id;
      const tId = typeof l.target === 'string' ? l.target : l.target.id;
      if (!adjacency.has(sId)) adjacency.set(sId, new Set());
      if (!adjacency.has(tId)) adjacency.set(tId, new Set());
      adjacency.get(sId)!.add(tId);
      adjacency.get(tId)!.add(sId);
    }

    // Zoom
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Arrow markers
    const defs = svg.append('defs');

    // Ownership arrow: filled triangle (slate)
    defs.append('marker')
      .attr('id', 'arrowhead-ownership')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#475569');

    // Contribution arrow: open diamond (teal)
    defs.append('marker')
      .attr('id', 'arrowhead-contribution')
      .attr('viewBox', '0 -6 12 12')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0L6,-5L12,0L6,5Z')
      .attr('fill', 'none')
      .attr('stroke', '#14B8A6')
      .attr('stroke-width', 1.5);

    // Glow filter for high-connection nodes
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
        .id((d: unknown) => (d as GraphNode).id)
        .distance(80)
        .strength(0.4))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: unknown) => getNodeRadius(d as GraphNode) + 4))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY().strength(0.08).y((d: unknown) => {
        const node = d as GraphNode;
        if (node.type === 'org-objective' || node.type === 'org-kr') return height * 0.2;
        if (node.type === 'team-objective' || node.type === 'team-kr') return height * 0.5;
        return height * 0.8;
      }));

    // Links
    const linkSelection = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => {
        if (d.relationship === 'contribution') return '#14B8A6'; // teal for contributions
        // Ownership: subtle slate tones by hierarchy level
        if (d.type === 'org-to-team') return '#475569';
        if (d.type === 'team-to-individual') return '#334155';
        return '#3B82F6';
      })
      .attr('stroke-opacity', (d) => d.relationship === 'contribution' ? 0.6 : 0.4)
      .attr('stroke-width', (d) => {
        if (d.relationship === 'contribution') return 2;
        return 1.5;
      })
      .attr('stroke-dasharray', (d) => d.relationship === 'contribution' ? '6,3' : 'none')
      .attr('marker-end', (d) =>
        d.relationship === 'contribution'
          ? 'url(#arrowhead-contribution)'
          : 'url(#arrowhead-ownership)'
      )
      .style('transition', 'stroke-opacity 0.2s, stroke-width 0.2s');

    // Node groups
    const nodeSelection = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node circles — uniform size per level, color intensity by connection count
    nodeSelection.append('circle')
      .attr('r', (d) => getNodeRadius(d))
      .attr('fill', (d) => getNodeFill(d, maxConnections))
      .attr('stroke', (d) => getNodeStroke(d))
      .attr('stroke-width', (d) => LEVEL_STROKE_WIDTH[getNodeLevel(d.type)])
      .attr('filter', (d) => d.connectionCount > 6 ? 'url(#glow)' : null)
      .style('transition', 'opacity 0.2s');

    // Connection count badge for high-connection nodes
    nodeSelection.filter((d) => d.connectionCount > 3)
      .append('text')
      .attr('class', 'node-badge')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', () => 11) // fixed badge size
      .attr('font-weight', '700')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text((d) => d.connectionCount);

    // Labels for org-level and individual nodes
    nodeSelection.filter((d) => d.type === 'org-objective' || d.type === 'org-kr' || d.type === 'individual')
      .append('text')
      .attr('class', 'node-label')
      .attr('x', (d) => getNodeRadius(d) + 6)
      .attr('y', 4)
      .attr('font-size', (d) => d.type === 'org-objective' ? 13 : 12)
      .attr('font-weight', (d) => d.type === 'org-objective' ? 600 : 500)
      .attr('fill', '#222222')
      .attr('stroke', '#F9F9F9')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke fill')
      .attr('pointer-events', 'none')
      .style('transition', 'opacity 0.2s')
      .text((d) => {
        const maxLen = d.type === 'org-objective' ? 40 : 25;
        return d.label.length > maxLen ? d.label.slice(0, maxLen) + '...' : d.label;
      });

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // === D3-native hover highlighting (no React state changes) ===
    nodeSelection.on('mouseover', (event, d) => {
      // Show tooltip positioned relative to the SVG container
      const svgRect = svgRef.current?.getBoundingClientRect();
      const tooltipX = event.clientX - (svgRect?.left || 0) + 16;
      const tooltipY = event.clientY - (svgRect?.top || 0) - 10;

      tooltip
        .style('display', 'block')
        .style('left', tooltipX + 'px')
        .style('top', tooltipY + 'px')
        .html(`
          <div class="tooltip-label">${d.label}</div>
          <div class="tooltip-type">${d.type.replace(/-/g, ' ')}</div>
          ${d.teamName ? `<div class="tooltip-team">${d.teamName}</div>` : ''}
          ${d.individualName ? `<div class="tooltip-team">${d.individualName}</div>` : ''}
          <div style="margin-top:4px;color:#64748B;font-size:11px">Connections: ${d.connectionCount}</div>
        `);

      // Get neighbors of hovered node
      const neighbors = adjacency.get(d.id) || new Set<string>();

      // Dim non-connected nodes (use 0.2 instead of 0.12 since rgba fills can be faint)
      nodeSelection.select('circle')
        .attr('opacity', (n) => {
          if (n.id === d.id) return 1;
          if (neighbors.has(n.id)) return 1;
          return 0.2;
        });

      // Dim non-connected labels
      nodeSelection.select('.node-label')
        .attr('opacity', (n) => {
          if (n.id === d.id) return 1;
          if (neighbors.has(n.id)) return 0.9;
          return 0.08;
        });

      // Dim non-connected badges
      nodeSelection.select('.node-badge')
        .attr('opacity', (n) => {
          if (n.id === d.id) return 1;
          if (neighbors.has(n.id)) return 1;
          return 0.08;
        });

      // Highlight connected links, dim others
      linkSelection
        .attr('stroke-opacity', (l) => {
          const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
          const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
          if (sId === d.id || tId === d.id) return 0.9;
          return 0.04;
        })
        .attr('stroke-width', (l) => {
          const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
          const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
          if (sId === d.id || tId === d.id) return 3;
          return l.type === 'org-to-individual' ? 2 : 1.5;
        });
    })
      .on('mousemove', (event) => {
        const svgRect = svgRef.current?.getBoundingClientRect();
        const tooltipX = event.clientX - (svgRect?.left || 0) + 16;
        const tooltipY = event.clientY - (svgRect?.top || 0) - 10;

        tooltip
          .style('left', tooltipX + 'px')
          .style('top', tooltipY + 'px');
      })
      .on('mouseout', () => {
        // Hide tooltip
        tooltip.style('display', 'none');

        // Restore to selection state (read from ref for latest value)
        applySelectionVisuals(selectedNodeRef.current, false);
      })
      .on('click', (_event, d) => {
        // Toggle logic: read from ref so we always have the latest value
        const newSelectedId = selectedNodeRef.current === d.id ? null : d.id;

        // Update ref immediately so subsequent hover/mouseout reads the new value
        selectedNodeRef.current = newSelectedId;

        // Apply animated transition (300ms)
        applySelectionVisuals(newSelectedId, true);

        // Dispatch to React for detail panel
        dispatch({ type: 'SET_SELECTED_NODE', payload: newSelectedId });
      });

    // === Reusable function: apply selection dim/highlight with optional animation ===
    function applySelectionVisuals(selectedId: string | null, animate: boolean) {
      const dur = animate ? 300 : 0;
      const ease = d3.easeCubicOut;

      if (selectedId) {
        const neighbors = adjacency.get(selectedId) || new Set<string>();

        nodeSelection.select('circle')
          .transition().duration(dur).ease(ease)
          .attr('opacity', (n: GraphNode) =>
            n.id === selectedId || neighbors.has(n.id) ? 1 : 0.15
          );

        nodeSelection.select('.node-label')
          .transition().duration(dur).ease(ease)
          .attr('opacity', (n: GraphNode) =>
            n.id === selectedId || neighbors.has(n.id) ? 1 : 0.1
          );

        nodeSelection.select('.node-badge')
          .transition().duration(dur).ease(ease)
          .attr('opacity', (n: GraphNode) =>
            n.id === selectedId || neighbors.has(n.id) ? 1 : 0.1
          );

        linkSelection
          .transition().duration(dur).ease(ease)
          .attr('stroke-opacity', (l: GraphLink) => {
            const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
            const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
            return (sId === selectedId || tId === selectedId) ? 0.8 : 0.05;
          })
          .attr('stroke-width', (l: GraphLink) => {
            const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
            const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
            return (sId === selectedId || tId === selectedId) ? 2.5 : (l.type === 'org-to-individual' ? 2 : 1.5);
          });
      } else {
        // Restore everything to defaults
        nodeSelection.select('circle')
          .transition().duration(dur).ease(ease)
          .attr('opacity', 1);

        nodeSelection.select('.node-label')
          .transition().duration(dur).ease(ease)
          .attr('opacity', 1);

        nodeSelection.select('.node-badge')
          .transition().duration(dur).ease(ease)
          .attr('opacity', 1);

        linkSelection
          .transition().duration(dur).ease(ease)
          .attr('stroke-opacity', 0.5)
          .attr('stroke-width', (l: GraphLink) => l.type === 'org-to-individual' ? 2 : 1.5);
      }
    }

    // Expose D3 selections and helper to refs so the secondary effect can use them
    nodeSelRef.current = nodeSelection;
    linkSelRef.current = linkSelection;
    adjacencyRef.current = adjacency;
    applySelectionVisualsRef.current = applySelectionVisuals;

    // Apply initial selection state if page loads with a selected node (e.g. from URL)
    if (selectedNodeRef.current) {
      applySelectionVisuals(selectedNodeRef.current, false);
    }

    // Tick
    simulation.on('tick', () => {
      linkSelection
        .attr('x1', (d) => (d.source as GraphNode).x ?? 0)
        .attr('y1', (d) => (d.source as GraphNode).y ?? 0)
        .attr('x2', (d) => (d.target as GraphNode).x ?? 0)
        .attr('y2', (d) => (d.target as GraphNode).y ?? 0);

      nodeSelection.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Initial zoom to fit
    setTimeout(() => {
      const bounds = (g.node() as SVGGElement)?.getBBox();
      if (bounds && bounds.width > 0) {
        const scale = Math.min(
          width / (bounds.width + 100),
          height / (bounds.height + 100),
          1.5
        );
        const tx = width / 2 - (bounds.x + bounds.width / 2) * scale;
        const ty = height / 2 - (bounds.y + bounds.height / 2) * scale;
        svg.transition().duration(500).call(
          zoom.transform,
          d3.zoomIdentity.translate(tx, ty).scale(scale)
        );
      }
    }, 1500);

    return () => {
      simulation.stop();
    };
    // Only rebuild when data or structural filters change — NOT on hover/highlight/selection changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filters.selectedTeams, filters.searchQuery, filters.selectedPeriod, getNodeRadius, getNodeFill, getNodeStroke, dispatch]);

  // Secondary effect: respond to external selection changes (e.g. detail panel close button)
  // This runs when React state changes selectedNodeId without going through the D3 click handler
  useEffect(() => {
    if (applySelectionVisualsRef.current) {
      applySelectionVisualsRef.current(filters.selectedNodeId, true);
    }
  }, [filters.selectedNodeId]);

  return (
    <>
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="tooltip" style={{ display: 'none' }} />
    </>
  );
}
