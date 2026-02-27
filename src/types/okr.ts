export interface OrgObjective {
  id: string;
  title: string;
  keyResults: OrgKeyResult[];
}

export interface OrgKeyResult {
  id: string;
  objectiveId: string;
  title: string;
}

export interface Team {
  id: string;
  name: string;
  type: 'country' | 'technical' | 'thematic';
  objectives: TeamObjective[];
}

export interface TeamObjective {
  id: string;
  teamId: string;
  title: string;
  keyResults: TeamKeyResult[];
}

export interface TeamKeyResult {
  id: string;
  objectiveId: string;
  teamId: string;
  title: string;
  linkedOrgKRId: string | null;
}

export interface Individual {
  id: string;
  name: string;
  teamId: string;
  role?: string;
  keyResults: IndividualKeyResult[];
}

export interface IndividualKeyResult {
  id: string;
  individualId: string;
  title: string;
  period: 'H1' | 'H2';
  year: number;
  linkedTeamKRId: string | null;
  linkedOrgKRId: string | null;
}

export interface OKRData {
  orgObjectives: OrgObjective[];
  teams: Team[];
  individuals: Individual[];
}

// Graph node/link types for D3
export type NodeType = 'org-objective' | 'org-kr' | 'team-objective' | 'team-kr' | 'individual' | 'individual-kr';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  teamId?: string;
  teamName?: string;
  individualName?: string;
  connectionCount: number;
  // D3 simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'org-to-team' | 'team-to-individual' | 'org-to-individual';
  relationship: 'ownership' | 'contribution';
}

export type ViewMode = 'network' | 'hierarchy' | 'matrix' | 'sankey';

export interface FilterState {
  selectedTeams: string[];
  selectedPeriod: 'all' | 'H1' | 'H2';
  selectedYear: number | null;
  searchQuery: string;
  highlightedNodeId: string | null;
  selectedNodeId: string | null;
}
