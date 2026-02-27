import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useOKR } from '../../context/OKRContext';
import { getTeamColor } from '../../utils/colors';

interface TreeNode {
  name: string;
  type: string;
  id: string;
  teamId?: string;
  children?: TreeNode[];
}

export default function HierarchyTree() {
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

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Build hierarchy data
    const root: TreeNode = {
      name: 'Organization OKRs',
      type: 'root',
      id: 'root',
      children: data.orgObjectives.map((obj) => ({
        name: obj.title,
        type: 'org-objective',
        id: obj.id,
        children: obj.keyResults.map((kr) => {
          // Find teams linked to this org KR
          const linkedTeams: TreeNode[] = [];
          for (const team of data.teams) {
            if (filters.selectedTeams.length > 0 && !filters.selectedTeams.includes(team.id)) continue;
            for (const tobj of team.objectives) {
              for (const tkr of tobj.keyResults) {
                if (tkr.linkedOrgKRId === kr.id) {
                  // Find individuals linked to this team KR
                  const linkedPeople: TreeNode[] = [];
                  for (const person of data.individuals) {
                    for (const ikr of person.keyResults) {
                      if (ikr.linkedTeamKRId === tkr.id) {
                        if (filters.selectedPeriod !== 'all' && ikr.period !== filters.selectedPeriod) continue;
                        linkedPeople.push({
                          name: `${person.name}: ${ikr.title}`,
                          type: 'individual-kr',
                          id: ikr.id,
                          teamId: team.id,
                        });
                      }
                    }
                  }
                  linkedTeams.push({
                    name: `[${team.name}] ${tkr.title}`,
                    type: 'team-kr',
                    id: tkr.id,
                    teamId: team.id,
                    children: linkedPeople.length > 0 ? linkedPeople : undefined,
                  });
                }
              }
            }
          }
          return {
            name: kr.title,
            type: 'org-kr',
            id: kr.id,
            children: linkedTeams.length > 0 ? linkedTeams : undefined,
          };
        }),
      })),
    };

    const hierarchy = d3.hierarchy(root);
    const treeLayout = d3.tree<TreeNode>().size([height - 80, width - 300]);
    treeLayout(hierarchy);

    const g = svg.append('g').attr('transform', 'translate(120, 40)');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(120, 40).scale(0.8));

    // Links
    g.selectAll('path.link')
      .data(hierarchy.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<d3.HierarchyLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x((d) => d.y)
        .y((d) => d.x) as unknown as string)
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const target = d.target.data;
        if (target.teamId) return getTeamColor(target.teamId);
        return '#334155';
      })
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.5);

    // Nodes
    const nodeG = g.selectAll<SVGGElement, d3.HierarchyPointNode<TreeNode>>('g.node')
      .data(hierarchy.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .attr('cursor', 'pointer');

    nodeG.append('circle')
      .attr('r', (d) => {
        if (d.data.type === 'root') return 12;
        if (d.data.type === 'org-objective') return 10;
        if (d.data.type === 'org-kr') return 8;
        if (d.data.type === 'team-kr') return 7;
        return 5;
      })
      .attr('fill', (d) => {
        if (d.data.type === 'root') return '#3B82F6';
        if (d.data.type === 'org-objective') return '#1E293B';
        if (d.data.type === 'org-kr') return '#475569';
        if (d.data.teamId) return getTeamColor(d.data.teamId);
        return '#94A3B8';
      })
      .attr('stroke', (d) => {
        if (d.data.teamId) return getTeamColor(d.data.teamId);
        return '#64748B';
      })
      .attr('stroke-width', 1.5);

    // Labels
    nodeG.append('text')
      .attr('x', (d) => d.children ? -12 : 12)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => d.children ? 'end' : 'start')
      .attr('font-size', (d) => {
        if (d.data.type === 'root') return 14;
        if (d.data.type === 'org-objective') return 13;
        return 12;
      })
      .attr('font-weight', (d) => {
        if (d.data.type === 'root' || d.data.type === 'org-objective') return 600;
        return 500;
      })
      .attr('fill', '#222222')
      .attr('stroke', '#F9F9F9')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke fill')
      .text((d) => {
        const maxLen = d.data.type === 'individual-kr' ? 50 : 45;
        return d.data.name.length > maxLen ? d.data.name.slice(0, maxLen) + '...' : d.data.name;
      });

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    nodeG.on('mouseover', (event, d) => {
      tooltip
        .style('display', 'block')
        .style('left', event.pageX + 12 + 'px')
        .style('top', event.pageY - 10 + 'px')
        .html(`
          <div class="tooltip-label">${d.data.name}</div>
          <div class="tooltip-type">${d.data.type.replace(/-/g, ' ')}</div>
        `);
    })
      .on('mousemove', (event) => {
        tooltip.style('left', event.pageX + 12 + 'px').style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      })
      .on('click', (_event, d) => {
        dispatch({
          type: 'SET_SELECTED_NODE',
          payload: filters.selectedNodeId === d.data.id ? null : d.data.id,
        });
      });

  }, [data, filters.selectedTeams, filters.selectedPeriod, filters.selectedNodeId, dispatch]);

  return (
    <>
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="tooltip" style={{ display: 'none' }} />
    </>
  );
}
