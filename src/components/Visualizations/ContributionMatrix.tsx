import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useOKR } from '../../context/OKRContext';
import { getContributionMatrix, getIndividualHighlightIds, isIndividualNode } from '../../utils/linkAnalysis';
import { getTeamColor } from '../../utils/colors';

export default function ContributionMatrix() {
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
    const fullWidth = container.clientWidth;
    const fullHeight = container.clientHeight;

    const margin = { top: 180, right: 40, bottom: 40, left: 200 };
    const { individuals, orgKRs, matrix } = getContributionMatrix(data);

    // Filter by selected teams
    let filteredIndices = individuals.map((_, i) => i);
    if (filters.selectedTeams.length > 0) {
      filteredIndices = filteredIndices.filter((i) =>
        filters.selectedTeams.includes(individuals[i].teamId)
      );
    }

    const filteredIndividuals = filteredIndices.map((i) => individuals[i]);
    const filteredMatrix = filteredIndices.map((i) => matrix[i]);

    const cellSize = Math.min(
      (fullWidth - margin.left - margin.right) / orgKRs.length,
      (fullHeight - margin.top - margin.bottom) / filteredIndividuals.length,
      60
    );
    const clampedCellSize = Math.max(cellSize, 30);

    const width = margin.left + orgKRs.length * clampedCellSize + margin.right;
    const height = margin.top + filteredIndividuals.length * clampedCellSize + margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const maxVal = d3.max(filteredMatrix.flat()) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxVal + 0.5]);

    // Compute highlight state
    const hasHighlight = isIndividualNode(data, filters.selectedNodeId);
    const highlightIds = hasHighlight
      ? getIndividualHighlightIds(data, filters.selectedNodeId!)
      : null;
    const highlightRowIdx = hasHighlight
      ? filteredIndividuals.findIndex((ind) => ind.id === filters.selectedNodeId!)
      : -1;
    // Build set of org KR column indices that the highlighted individual contributes to
    const highlightCols = new Set<number>();
    if (highlightIds) {
      orgKRs.forEach((kr, col) => {
        if (highlightIds.has(kr.id)) highlightCols.add(col);
      });
    }

    // Row labels (individuals)
    g.selectAll('text.row-label')
      .data(filteredIndividuals)
      .join('text')
      .attr('class', 'row-label')
      .attr('x', margin.left - 10)
      .attr('y', (_, i) => margin.top + i * clampedCellSize + clampedCellSize / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', (_, i) => highlightRowIdx === i ? 700 : 500)
      .attr('fill', '#222222')
      .attr('opacity', (_, i) => {
        if (!highlightIds) return 1;
        return i === highlightRowIdx ? 1 : 0.15;
      })
      .text((d) => d.name);

    // Team color indicators
    g.selectAll('rect.team-indicator')
      .data(filteredIndividuals)
      .join('rect')
      .attr('class', 'team-indicator')
      .attr('x', margin.left - 4)
      .attr('y', (_, i) => margin.top + i * clampedCellSize + 2)
      .attr('width', 3)
      .attr('height', clampedCellSize - 4)
      .attr('rx', 1.5)
      .attr('fill', (d) => getTeamColor(d.teamId))
      .attr('opacity', (_, i) => {
        if (!highlightIds) return 1;
        return i === highlightRowIdx ? 1 : 0.15;
      });

    // Column labels (org KRs)
    g.selectAll('text.col-label')
      .data(orgKRs)
      .join('text')
      .attr('class', 'col-label')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', (_, i) =>
        `translate(${margin.left + i * clampedCellSize + clampedCellSize / 2}, ${margin.top - 10}) rotate(-45)`
      )
      .attr('text-anchor', 'start')
      .attr('font-size', 11)
      .attr('font-weight', (_, i) => highlightCols.has(i) ? 700 : 500)
      .attr('fill', '#616161')
      .attr('opacity', (_, i) => {
        if (!highlightIds) return 1;
        return highlightCols.has(i) ? 1 : 0.15;
      })
      .text((d) => d.title.length > 35 ? d.title.slice(0, 35) + '...' : d.title);

    // Cells
    const tooltip = d3.select(tooltipRef.current);

    for (let row = 0; row < filteredMatrix.length; row++) {
      for (let col = 0; col < orgKRs.length; col++) {
        const value = filteredMatrix[row][col];
        const isHighlightedCell = highlightIds && row === highlightRowIdx && highlightCols.has(col);
        const isDimmed = highlightIds && !isHighlightedCell;

        const rect = g.append('rect')
          .attr('x', margin.left + col * clampedCellSize + 1)
          .attr('y', margin.top + row * clampedCellSize + 1)
          .attr('width', clampedCellSize - 2)
          .attr('height', clampedCellSize - 2)
          .attr('rx', 4)
          .attr('fill', value > 0 ? colorScale(value) : '#1E293B')
          .attr('stroke', isHighlightedCell ? '#F59E0B' : value > 0 ? '#3B82F6' : '#334155')
          .attr('stroke-width', isHighlightedCell ? 2.5 : value > 0 ? 1 : 0.5)
          .attr('opacity', isDimmed ? 0.1 : 1)
          .attr('cursor', 'pointer');

        if (value > 0) {
          g.append('text')
            .attr('x', margin.left + col * clampedCellSize + clampedCellSize / 2)
            .attr('y', margin.top + row * clampedCellSize + clampedCellSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 13)
            .attr('font-weight', 700)
            .attr('fill', value > maxVal / 2 ? 'white' : '#222222')
            .attr('pointer-events', 'none')
            .attr('opacity', isDimmed ? 0.1 : 1)
            .text(value);
        }

        rect.on('mouseover', (event) => {
          tooltip
            .style('display', 'block')
            .style('left', event.pageX + 12 + 'px')
            .style('top', event.pageY - 10 + 'px')
            .html(`
              <div class="tooltip-label">${filteredIndividuals[row].name}</div>
              <div style="margin-top:4px;color:#94A3B8;font-size:11px">${orgKRs[col].title}</div>
              <div style="margin-top:4px;color:#3B82F6;font-weight:600">${value} contributing KR${value !== 1 ? 's' : ''}</div>
            `);
        })
          .on('mousemove', (event) => {
            tooltip.style('left', event.pageX + 12 + 'px').style('top', event.pageY - 10 + 'px');
          })
          .on('mouseout', () => tooltip.style('display', 'none'))
          .on('click', () => {
            const id = filteredIndividuals[row].id;
            dispatch({
              type: 'SET_SELECTED_NODE',
              payload: filters.selectedNodeId === id ? null : id,
            });
          });
      }
    }

    // Team group separators
    let prevTeam = '';
    filteredIndividuals.forEach((ind, i) => {
      if (ind.teamId !== prevTeam && i > 0) {
        g.append('line')
          .attr('x1', margin.left)
          .attr('x2', margin.left + orgKRs.length * clampedCellSize)
          .attr('y1', margin.top + i * clampedCellSize)
          .attr('y2', margin.top + i * clampedCellSize)
          .attr('stroke', '#475569')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4');
      }
      prevTeam = ind.teamId;
    });

  }, [data, filters.selectedTeams, filters.selectedNodeId, dispatch]);

  return (
    <>
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="tooltip" style={{ display: 'none' }} />
    </>
  );
}
