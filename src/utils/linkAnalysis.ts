import type { OKRData, GraphNode, GraphLink } from '../types/okr';

export interface AnalysisResult {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function buildGraph(data: OKRData): AnalysisResult {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const connectionCount: Record<string, number> = {};

  const incConnection = (id: string) => {
    connectionCount[id] = (connectionCount[id] || 0) + 1;
  };

  // Org objective nodes
  for (const obj of data.orgObjectives) {
    nodes.push({
      id: obj.id,
      label: obj.title,
      type: 'org-objective',
      connectionCount: 0,
    });

    for (const kr of obj.keyResults) {
      nodes.push({
        id: kr.id,
        label: kr.title,
        type: 'org-kr',
        connectionCount: 0,
      });
      links.push({ source: obj.id, target: kr.id, type: 'org-to-team' });
      incConnection(obj.id);
      incConnection(kr.id);
    }
  }

  // Team nodes and links to org
  for (const team of data.teams) {
    for (const obj of team.objectives) {
      nodes.push({
        id: obj.id,
        label: obj.title,
        type: 'team-objective',
        teamId: team.id,
        teamName: team.name,
        connectionCount: 0,
      });

      for (const kr of obj.keyResults) {
        nodes.push({
          id: kr.id,
          label: kr.title,
          type: 'team-kr',
          teamId: team.id,
          teamName: team.name,
          connectionCount: 0,
        });
        links.push({ source: obj.id, target: kr.id, type: 'org-to-team' });
        incConnection(obj.id);
        incConnection(kr.id);

        if (kr.linkedOrgKRId) {
          links.push({ source: kr.id, target: kr.linkedOrgKRId, type: 'org-to-team' });
          incConnection(kr.id);
          incConnection(kr.linkedOrgKRId);
        }
      }
    }
  }

  // Individual nodes and links to team/org
  for (const person of data.individuals) {
    const team = data.teams.find((t) => t.id === person.teamId);

    nodes.push({
      id: person.id,
      label: person.name,
      type: 'individual',
      teamId: person.teamId,
      teamName: team?.name,
      individualName: person.name,
      connectionCount: 0,
    });

    for (const kr of person.keyResults) {
      nodes.push({
        id: kr.id,
        label: kr.title,
        type: 'individual-kr',
        teamId: person.teamId,
        teamName: team?.name,
        individualName: person.name,
        connectionCount: 0,
      });

      links.push({ source: person.id, target: kr.id, type: 'team-to-individual' });
      incConnection(person.id);
      incConnection(kr.id);

      if (kr.linkedTeamKRId) {
        links.push({ source: kr.id, target: kr.linkedTeamKRId, type: 'team-to-individual' });
        incConnection(kr.id);
        incConnection(kr.linkedTeamKRId);
      }
      if (kr.linkedOrgKRId) {
        links.push({ source: kr.id, target: kr.linkedOrgKRId, type: 'org-to-individual' });
        incConnection(kr.id);
        incConnection(kr.linkedOrgKRId);
      }
    }
  }

  // Apply connection counts
  for (const node of nodes) {
    node.connectionCount = connectionCount[node.id] || 0;
  }

  return { nodes, links };
}

export function getContributionMatrix(data: OKRData): {
  individuals: { id: string; name: string; teamId: string; teamName: string }[];
  orgKRs: { id: string; title: string; objectiveTitle: string }[];
  matrix: number[][];
} {
  const individuals = data.individuals.map((p) => {
    const team = data.teams.find((t) => t.id === p.teamId);
    return { id: p.id, name: p.name, teamId: p.teamId, teamName: team?.name || '' };
  });

  const orgKRs = data.orgObjectives.flatMap((obj) =>
    obj.keyResults.map((kr) => ({ id: kr.id, title: kr.title, objectiveTitle: obj.title }))
  );

  const matrix: number[][] = [];

  for (const person of data.individuals) {
    const row: number[] = [];
    for (const orgKR of orgKRs) {
      let count = 0;
      for (const ikr of person.keyResults) {
        // Direct link to org KR
        if (ikr.linkedOrgKRId === orgKR.id) {
          count++;
          continue;
        }
        // Indirect: ikr -> team KR -> org KR
        if (ikr.linkedTeamKRId) {
          for (const team of data.teams) {
            for (const tobj of team.objectives) {
              for (const tkr of tobj.keyResults) {
                if (tkr.id === ikr.linkedTeamKRId && tkr.linkedOrgKRId === orgKR.id) {
                  count++;
                }
              }
            }
          }
        }
      }
      row.push(count);
    }
    matrix.push(row);
  }

  return { individuals, orgKRs, matrix };
}

export function getSankeyData(data: OKRData): {
  nodes: { id: string; label: string; layer: number; teamId?: string }[];
  links: { source: string; target: string; value: number }[];
} {
  const nodes: { id: string; label: string; layer: number; teamId?: string }[] = [];
  const linkMap: Record<string, number> = {};

  // Layer 0: Org KRs
  for (const obj of data.orgObjectives) {
    for (const kr of obj.keyResults) {
      nodes.push({ id: kr.id, label: kr.title, layer: 0 });
    }
  }

  // Layer 1: Team KRs
  for (const team of data.teams) {
    for (const obj of team.objectives) {
      for (const kr of obj.keyResults) {
        nodes.push({ id: kr.id, label: kr.title, layer: 1, teamId: team.id });
        if (kr.linkedOrgKRId) {
          const key = `${kr.id}->${kr.linkedOrgKRId}`;
          linkMap[key] = (linkMap[key] || 0) + 1;
        }
      }
    }
  }

  // Layer 2: Individuals (aggregate their KRs)
  for (const person of data.individuals) {
    nodes.push({ id: person.id, label: person.name, layer: 2, teamId: person.teamId });
    const teamKRCounts: Record<string, number> = {};
    for (const kr of person.keyResults) {
      if (kr.linkedTeamKRId) {
        teamKRCounts[kr.linkedTeamKRId] = (teamKRCounts[kr.linkedTeamKRId] || 0) + 1;
      }
    }
    for (const [teamKRId, count] of Object.entries(teamKRCounts)) {
      const key = `${person.id}->${teamKRId}`;
      linkMap[key] = count;
    }
  }

  const links = Object.entries(linkMap).map(([key, value]) => {
    const [source, target] = key.split('->');
    return { source, target, value };
  });

  return { nodes, links };
}
