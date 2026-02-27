const TEAM_COLORS: Record<string, string> = {};

const PALETTE = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
];

let colorIndex = 0;

export function getTeamColor(teamId: string): string {
  if (!TEAM_COLORS[teamId]) {
    TEAM_COLORS[teamId] = PALETTE[colorIndex % PALETTE.length];
    colorIndex++;
  }
  return TEAM_COLORS[teamId];
}

export function resetColors(): void {
  Object.keys(TEAM_COLORS).forEach((k) => delete TEAM_COLORS[k]);
  colorIndex = 0;
}

export const NODE_COLORS = {
  'org-objective': '#1E293B',
  'org-kr': '#475569',
  'team-objective': '#64748B',
  'team-kr': '#94A3B8',
  'individual': '#CBD5E1',
  'individual-kr': '#E2E8F0',
} as const;

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
