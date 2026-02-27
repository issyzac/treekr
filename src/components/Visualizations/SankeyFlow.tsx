import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import type { SankeyNode, SankeyLink } from 'd3-sankey';
import { useOKR } from '../../context/OKRContext';
import { getSankeyData } from '../../utils/linkAnalysis';
import { getTeamColor } from '../../utils/colors';

interface SNode {
  id: string;
  label: string;
  layer: number;
  teamId?: string;
}

interface SLink {
  source: string;
  target: string;
  value: number;
}

export default function SankeyFlow() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useOKR();
  const { data, filters } = state;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const margin = { top: 20, right: 160, bottom: 20, left: 160 };

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const { nodes: rawNodes, links: rawLinks } = getSankeyData(data);

    // Filter by team
    let filteredNodes = rawNodes;
    if (filters.selectedTeams.length > 0) {
      filteredNodes = rawNodes.filter(
        (n) => !n.teamId || filters.selectedTeams.includes(n.teamId) || n.layer === 0
      );
    }

    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = rawLinks.filter(
      (l) => nodeIds.has(l.source) && nodeIds.has(l.target)
    );

    if (filteredNodes.length === 0 || filteredLinks.length === 0) {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#616161')
        .text('No data to display with current filters');
      return;
    }

    // Build index maps for sankey
    const nodeIndex = new Map<string, number>();
    filteredNodes.forEach((n, i) => nodeIndex.set(n.id, i));

    const sankeyNodes = filteredNodes.map((n) => ({ ...n }));
    const sankeyLinks = filteredLinks
      .filter((l) => nodeIndex.has(l.source) && nodeIndex.has(l.target))
      .map((l) => ({
        source: nodeIndex.get(l.source)!,
        target: nodeIndex.get(l.target)!,
        value: l.value,
      }));

    const sankeyLayout = sankey<SNode, SLink>()
      .nodeWidth(20)
      .nodePadding(14)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    try {
      const graph = sankeyLayout({
        nodes: sankeyNodes as unknown as SankeyNode<SNode, SLink>[],
        links: sankeyLinks as unknown as SankeyLink<SNode, SLink>[],
      });

      // Links
      const tooltip = d3.select(tooltipRef.current);

      g.append('g')
        .selectAll('path')
        .data(graph.links)
        .join('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('fill', 'none')
        .attr('stroke', (d) => {
          const sourceNode = d.source as SankeyNode<SNode, SLink>;
          if ((sourceNode as unknown as SNode).teamId) {
            return getTeamColor((sourceNode as unknown as SNode).teamId!);
          }
          return '#475569';
        })
        .attr('stroke-width', (d) => Math.max(1, d.width || 1))
        .attr('stroke-opacity', 0.35)
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget).attr('stroke-opacity', 0.7);
          const sNode = d.source as SankeyNode<SNode, SLink> & SNode;
          const tNode = d.target as SankeyNode<SNode, SLink> & SNode;
          tooltip
            .style('display', 'block')
            .style('left', event.pageX + 12 + 'px')
            .style('top', event.pageY - 10 + 'px')
            .html(`
              <div class="tooltip-label">${sNode.label} &rarr; ${tNode.label}</div>
              <div style="color:#3B82F6;margin-top:4px">${d.value} contributing KR${d.value !== 1 ? 's' : ''}</div>
            `);
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget).attr('stroke-opacity', 0.35);
          tooltip.style('display', 'none');
        });

      // Nodes
      const nodeRects = g.append('g')
        .selectAll('rect')
        .data(graph.nodes)
        .join('rect')
        .attr('x', (d) => d.x0 || 0)
        .attr('y', (d) => d.y0 || 0)
        .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
        .attr('height', (d) => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
        .attr('rx', 3)
        .attr('fill', (d) => {
          const n = d as unknown as SNode;
          if (n.teamId) return getTeamColor(n.teamId);
          if (n.layer === 0) return '#475569';
          return '#94A3B8';
        })
        .attr('stroke', '#1E293B')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer');

      nodeRects.on('mouseover', (event, d) => {
        const n = d as unknown as SNode;
        tooltip
          .style('display', 'block')
          .style('left', event.pageX + 12 + 'px')
          .style('top', event.pageY - 10 + 'px')
          .html(`
            <div class="tooltip-label">${n.label}</div>
            <div class="tooltip-type">${n.layer === 0 ? 'Org KR' : n.layer === 1 ? 'Team KR' : 'Individual'}</div>
          `);
      })
        .on('mouseout', () => tooltip.style('display', 'none'))
        .on('click', (_event, d) => {
          const n = d as unknown as SNode;
          dispatch({ type: 'SET_SELECTED_NODE', payload: n.id });
        });

      // Node labels
      g.append('g')
        .selectAll('text')
        .data(graph.nodes)
        .join('text')
        .attr('x', (d) => {
          const n = d as unknown as SNode;
          return n.layer === 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6;
        })
        .attr('y', (d) => ((d.y0 || 0) + (d.y1 || 0)) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', (d) => {
          const n = d as unknown as SNode;
          return n.layer === 2 ? 'start' : 'end';
        })
        .attr('font-size', 11)
        .attr('font-weight', 500)
        .attr('fill', '#222222')
        .attr('stroke', '#F9F9F9')
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('paint-order', 'stroke fill')
        .text((d) => {
          const n = d as unknown as SNode;
          const maxLen = 35;
          return n.label.length > maxLen ? n.label.slice(0, maxLen) + '...' : n.label;
        });

      // Layer labels
      const layers = [
        { x: margin.left, label: 'Org Key Results' },
        { x: width / 2, label: 'Team Key Results' },
        { x: width - margin.right, label: 'Individuals' },
      ];
      layers.forEach((l) => {
        g.append('text')
          .attr('x', l.x)
          .attr('y', 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', 11)
          .attr('font-weight', 700)
          .attr('fill', '#616161')
          .attr('text-transform', 'uppercase')
          .text(l.label);
      });

    } catch {
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#616161')
        .text('Unable to render flow diagram with current data');
    }

  }, [data, filters.selectedTeams, dispatch]);

  return (
    <>
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="tooltip" style={{ display: 'none' }} />
    </>
  );
}
