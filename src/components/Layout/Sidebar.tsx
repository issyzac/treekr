import { useOKR } from '../../context/OKRContext';
import { getTeamColor } from '../../utils/colors';

export default function Sidebar() {
  const { state, dispatch } = useOKR();
  const { data, filters } = state;

  const handleTeamToggle = (teamId: string) => {
    const current = filters.selectedTeams;
    const next = current.includes(teamId)
      ? current.filter((t) => t !== teamId)
      : [...current, teamId];
    dispatch({ type: 'SET_SELECTED_TEAMS', payload: next });
  };

  const handlePeriod = (period: 'all' | 'H1' | 'H2') => {
    dispatch({ type: 'SET_SELECTED_PERIOD', payload: period });
  };

  const totalIndividualKRs = data.individuals.reduce((sum, p) => sum + p.keyResults.length, 0);
  const totalTeamKRs = data.teams.reduce(
    (sum, t) => sum + t.objectives.reduce((s, o) => s + o.keyResults.length, 0),
    0
  );
  const totalOrgKRs = data.orgObjectives.reduce((sum, o) => sum + o.keyResults.length, 0);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Search</div>
        <input
          type="text"
          className="sidebar-search"
          placeholder="Search OKRs, people..."
          value={filters.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
        />
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Teams</div>
        {data.teams.map((team) => (
          <div key={team.id} className="filter-item" onClick={() => handleTeamToggle(team.id)}>
            <input
              type="checkbox"
              checked={filters.selectedTeams.length === 0 || filters.selectedTeams.includes(team.id)}
              readOnly
            />
            <span className="team-dot" style={{ backgroundColor: getTeamColor(team.id) }} />
            <label>{team.name}</label>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Period</div>
        <div className="period-buttons">
          {(['all', 'H1', 'H2'] as const).map((p) => (
            <button
              key={p}
              className={`period-btn ${filters.selectedPeriod === p ? 'active' : ''}`}
              onClick={() => handlePeriod(p)}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">People</div>
        {data.individuals.map((person) => {
          const team = data.teams.find((t) => t.id === person.teamId);
          const visible =
            filters.selectedTeams.length === 0 || filters.selectedTeams.includes(person.teamId);
          if (!visible) return null;
          return (
            <div
              key={person.id}
              className="filter-item"
              onClick={() =>
                dispatch({
                  type: 'SET_SELECTED_NODE',
                  payload: filters.selectedNodeId === person.id ? null : person.id,
                })
              }
              style={{
                background: filters.selectedNodeId === person.id ? 'var(--bg-tertiary)' : undefined,
                borderRadius: 4,
                padding: '4px 6px',
              }}
            >
              <span
                className="team-dot"
                style={{ backgroundColor: getTeamColor(person.teamId) }}
              />
              <label style={{ flex: 1 }}>{person.name}</label>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {team?.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Summary</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <div>
            <strong style={{ color: 'var(--accent)' }}>{data.orgObjectives.length}</strong> Org Objectives
          </div>
          <div>
            <strong style={{ color: 'var(--accent)' }}>{totalOrgKRs}</strong> Org Key Results
          </div>
          <div>
            <strong style={{ color: 'var(--accent)' }}>{data.teams.length}</strong> Teams
          </div>
          <div>
            <strong style={{ color: 'var(--accent)' }}>{totalTeamKRs}</strong> Team Key Results
          </div>
          <div>
            <strong style={{ color: 'var(--accent)' }}>{data.individuals.length}</strong> Individuals
          </div>
          <div>
            <strong style={{ color: 'var(--accent)' }}>{totalIndividualKRs}</strong> Individual KRs
          </div>
        </div>
      </div>

      <div className="legend">
        <div className="sidebar-section-title">Legend</div>
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#1E293B', border: '2px solid #64748B' }} />
          Org Objective / KR
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#475569' }} />
          Team KR
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#94A3B8' }} />
          Individual KR
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: '#3B82F6' }} />
          Direct link
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          Node size = number of connections
        </div>
      </div>
    </aside>
  );
}
