import type {
  OKRData,
  OrgObjective,
  OrgKeyResult,
  Team,
  TeamObjective,
  TeamKeyResult,
  Individual,
  IndividualKeyResult,
} from '../types/okr';

let idCounter = 0;
function genId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

function fuzzyMatch(needle: string, haystack: string): boolean {
  const n = needle.toLowerCase().trim();
  const h = haystack.toLowerCase().trim();
  if (h.includes(n) || n.includes(h)) return true;
  // prefix match: first 30 chars
  const prefix = n.slice(0, 30);
  return h.startsWith(prefix) || h.includes(prefix);
}

function findTeamKR(teams: Team[], label: string, teamName?: string): string | null {
  const cleaned = label.replace(/^Team KR:\s*/i, '').trim();
  const teamsToSearch = teamName
    ? teams.filter((t) => t.name.toLowerCase() === teamName.toLowerCase())
    : teams;
  for (const team of teamsToSearch) {
    for (const obj of team.objectives) {
      for (const kr of obj.keyResults) {
        if (fuzzyMatch(cleaned, kr.title)) return kr.id;
      }
    }
  }
  // Fallback: search all teams
  if (teamName) {
    return findTeamKR(teams, label);
  }
  return null;
}

export function parseOKRText(text: string): OKRData {
  idCounter = 0;
  const lines = text.split('\n');
  const orgObjectives: OrgObjective[] = [];
  const teams: Team[] = [];
  const individualsMap: Map<string, Individual> = new Map();

  let currentSection: 'org' | 'team' | 'individual' | null = null;
  let currentTeam: Team | null = null;
  let currentObjective: OrgObjective | TeamObjective | null = null;
  let currentIndividual: Individual | null = null;
  let currentPeriod: 'H1' | 'H2' = 'H1';
  let currentYear = 2025;
  let currentTeamName = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Section headers
    const orgMatch = line.match(/^===\s*ORGANIZATION\s*===$/i);
    if (orgMatch) {
      currentSection = 'org';
      currentObjective = null;
      continue;
    }

    const teamMatch = line.match(/^===\s*TEAM:\s*(.+?)(?:\s*\|\s*Type:\s*(\w+))?\s*===$/i);
    if (teamMatch) {
      currentSection = 'team';
      const teamType = (teamMatch[2]?.toLowerCase() || 'thematic') as 'country' | 'technical' | 'thematic';
      currentTeam = {
        id: genId('team'),
        name: teamMatch[1].trim(),
        type: teamType,
        objectives: [],
      };
      teams.push(currentTeam);
      currentObjective = null;
      continue;
    }

    const indMatch = line.match(
      /^===\s*INDIVIDUAL:\s*(.+?)\s*\|\s*Team:\s*(.+?)\s*\|\s*Period:\s*(H[12])\s+(\d{4})\s*===$/i
    );
    if (indMatch) {
      currentSection = 'individual';
      const name = indMatch[1].trim();
      currentTeamName = indMatch[2].trim();
      currentPeriod = indMatch[3].toUpperCase() as 'H1' | 'H2';
      currentYear = parseInt(indMatch[4]);

      const matchingTeam = teams.find(
        (t) => t.name.toLowerCase() === currentTeamName.toLowerCase()
      );
      const teamId = matchingTeam?.id || '';

      // Check if individual already exists (multiple period entries)
      const key = `${name}|${teamId}`;
      if (individualsMap.has(key)) {
        currentIndividual = individualsMap.get(key)!;
      } else {
        currentIndividual = {
          id: genId('ind'),
          name,
          teamId,
          keyResults: [],
        };
        individualsMap.set(key, currentIndividual);
      }
      continue;
    }

    // Objective lines
    const objMatch = line.match(/^Objective:\s*(.+)$/i);
    if (objMatch) {
      if (currentSection === 'org') {
        currentObjective = {
          id: genId('org-obj'),
          title: objMatch[1].trim(),
          keyResults: [],
        };
        orgObjectives.push(currentObjective as OrgObjective);
      } else if (currentSection === 'team' && currentTeam) {
        currentObjective = {
          id: genId('team-obj'),
          teamId: currentTeam.id,
          title: objMatch[1].trim(),
          linkedOrgKRIds: [],
          keyResults: [],
        };
        currentTeam.objectives.push(currentObjective as TeamObjective);
      }
      continue;
    }

    // KR lines
    const krMatch = line.match(/^KR:\s*(.+?)(?:\s*->\s*\[(.+?)\])?$/i);
    if (krMatch) {
      const krTitle = krMatch[1].trim();
      const linkRef = krMatch[2]?.trim() || null;

      if (currentSection === 'org' && currentObjective) {
        const kr: OrgKeyResult = {
          id: genId('org-kr'),
          objectiveId: currentObjective.id,
          title: krTitle,
        };
        (currentObjective as OrgObjective).keyResults.push(kr);
      } else if (currentSection === 'team' && currentObjective && currentTeam) {
        const kr: TeamKeyResult = {
          id: genId('team-kr'),
          objectiveId: currentObjective.id,
          teamId: currentTeam.id,
          title: krTitle,
        };
        (currentObjective as TeamObjective).keyResults.push(kr);
      } else if (currentSection === 'individual' && currentIndividual) {
        let linkedTeamKRId: string | null = null;

        if (linkRef) {
          if (linkRef.toLowerCase().startsWith('team kr:')) {
            linkedTeamKRId = findTeamKR(teams, linkRef, currentTeamName);
          } else {
            // Try to match against team KRs
            linkedTeamKRId = findTeamKR(teams, linkRef, currentTeamName);
          }
        }

        const kr: IndividualKeyResult = {
          id: genId('ind-kr'),
          individualId: currentIndividual.id,
          title: krTitle,
          period: currentPeriod,
          year: currentYear,
          linkedTeamKRId,
        };
        currentIndividual.keyResults.push(kr);
      }
    }
  }

  return {
    orgObjectives,
    teams,
    individuals: Array.from(individualsMap.values()),
  };
}
