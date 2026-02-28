import { useOKR } from '../../context/OKRContext';
import { getTeamColor } from '../../utils/colors';
import type { OKRData, OrgObjective, Individual } from '../../types/okr';

type Dispatch = ReturnType<typeof useOKR>['dispatch'];

export default function DetailPanel() {
  const { state, dispatch } = useOKR();
  const { data, filters } = state;
  const nodeId = filters.selectedNodeId;

  if (!nodeId) return null;

  const orgObj = data.orgObjectives.find((o) => o.id === nodeId);
  const orgKR = data.orgObjectives.flatMap((o) => o.keyResults).find((kr) => kr.id === nodeId);
  const individual = data.individuals.find((p) => p.id === nodeId);

  let teamKR: { kr: { id: string; title: string }; teamName: string; teamId: string } | null = null;
  for (const t of data.teams) {
    for (const obj of t.objectives) {
      for (const kr of obj.keyResults) {
        if (kr.id === nodeId) {
          teamKR = { kr, teamName: t.name, teamId: t.id };
        }
      }
    }
  }

  const indKR = data.individuals.flatMap((p) =>
    p.keyResults.map((kr) => ({ ...kr, personName: p.name, teamId: p.teamId }))
  ).find((kr) => kr.id === nodeId);

  const close = () => dispatch({ type: 'SET_SELECTED_NODE', payload: null });

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h3>Details</h3>
        <button className="detail-panel-close" onClick={close}>&times;</button>
      </div>
      <div className="detail-panel-body">
        {orgObj && <OrgObjectiveDetail obj={orgObj} data={data} dispatch={dispatch} />}
        {orgKR && !orgObj && <OrgKRDetail kr={orgKR} data={data} dispatch={dispatch} />}
        {individual && <IndividualDetail person={individual} data={data} dispatch={dispatch} />}
        {teamKR && !individual && !orgObj && !orgKR && (
          <TeamKRDetail tkr={teamKR} data={data} dispatch={dispatch} />
        )}
        {indKR && !individual && !orgObj && !orgKR && !teamKR && (
          <IndKRDetail ikr={indKR} data={data} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}

function OrgObjectiveDetail({ obj, data, dispatch }: { obj: OrgObjective; data: OKRData; dispatch: Dispatch }) {
  const contributors = new Set<string>();
  for (const kr of obj.keyResults) {
    // Find team objectives that link to this org KR
    const linkedTeamKRIds = new Set<string>();
    for (const team of data.teams) {
      for (const tobj of team.objectives) {
        if (tobj.linkedOrgKRIds.includes(kr.id)) {
          for (const tkr of tobj.keyResults) {
            linkedTeamKRIds.add(tkr.id);
          }
        }
      }
    }
    // Find individuals whose KRs link to those team KRs
    for (const person of data.individuals) {
      for (const ikr of person.keyResults) {
        if (ikr.linkedTeamKRId && linkedTeamKRIds.has(ikr.linkedTeamKRId)) {
          contributors.add(person.id);
        }
      }
    }
  }

  return (
    <>
      <span className="detail-type-badge" style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}>
        Org Objective
      </span>
      <div className="detail-title">{obj.title}</div>
      <div className="detail-section">
        <div className="detail-section-title">Key Results ({obj.keyResults.length})</div>
        {obj.keyResults.map((kr) => (
          <div key={kr.id} className="detail-kr-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: kr.id })} style={{ cursor: 'pointer' }}>
            {kr.title}
          </div>
        ))}
      </div>
      <div className="detail-section">
        <div className="detail-section-title">Contributors ({contributors.size})</div>
        {Array.from(contributors).map((pid) => {
          const person = data.individuals.find((p) => p.id === pid);
          const team = data.teams.find((t) => t.id === person?.teamId);
          return person ? (
            <div
              key={pid}
              className="detail-link-item"
              onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: pid })}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span className="team-dot" style={{ backgroundColor: getTeamColor(person.teamId) }} />
              <span>{person.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>{team?.name}</span>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}

function OrgKRDetail({ kr, data, dispatch }: { kr: { id: string; objectiveId: string; title: string }; data: OKRData; dispatch: Dispatch }) {
  const parentObj = data.orgObjectives.find((o) => o.id === kr.objectiveId);

  const linkedTeamKRs: { kr: { id: string; title: string }; teamName: string; teamId: string }[] = [];
  for (const team of data.teams) {
    for (const obj of team.objectives) {
      if (obj.linkedOrgKRIds.includes(kr.id)) {
        for (const tkr of obj.keyResults) {
          linkedTeamKRs.push({ kr: tkr, teamName: team.name, teamId: team.id });
        }
      }
    }
  }

  const contributors: { person: Individual; krs: Individual['keyResults'] }[] = [];
  for (const person of data.individuals) {
    const relevantKRs = person.keyResults.filter((ikr) => {
      return linkedTeamKRs.some((tkr) => ikr.linkedTeamKRId === tkr.kr.id);
    });
    if (relevantKRs.length > 0) {
      contributors.push({ person, krs: relevantKRs });
    }
  }

  return (
    <>
      <span className="detail-type-badge" style={{ backgroundColor: '#475569', color: '#CBD5E1' }}>
        Org Key Result
      </span>
      <div className="detail-title">{kr.title}</div>
      {parentObj && (
        <div className="detail-link-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: parentObj.id })}>
          Parent: {parentObj.title}
        </div>
      )}
      <div className="detail-section">
        <div className="detail-section-title">Linked Team KRs ({linkedTeamKRs.length})</div>
        {linkedTeamKRs.map((item) => (
          <div key={item.kr.id} className="detail-kr-item" style={{ borderLeftColor: getTeamColor(item.teamId), cursor: 'pointer' }} onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: item.kr.id })}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{item.teamName}</div>
            {item.kr.title}
          </div>
        ))}
      </div>
      <div className="detail-section">
        <div className="detail-section-title">Individual Contributors ({contributors.length})</div>
        {contributors.map(({ person, krs }) => (
          <div key={person.id} style={{ marginBottom: 10 }}>
            <div
              className="detail-link-item"
              onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: person.id })}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
            >
              <span className="team-dot" style={{ backgroundColor: getTeamColor(person.teamId) }} />
              {person.name}
            </div>
            {krs.map((ikr) => (
              <div key={ikr.id} style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 20, marginTop: 2 }}>
                {ikr.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function IndividualDetail({ person, data, dispatch }: { person: Individual; data: OKRData; dispatch: Dispatch }) {
  const team = data.teams.find((t) => t.id === person.teamId);

  const h1KRs = person.keyResults.filter((kr) => kr.period === 'H1');
  const h2KRs = person.keyResults.filter((kr) => kr.period === 'H2');

  const linkedOrgKRIds = new Set<string>();
  for (const ikr of person.keyResults) {
    if (ikr.linkedTeamKRId) {
      for (const t of data.teams) {
        for (const obj of t.objectives) {
          const hasTeamKR = obj.keyResults.some((tkr) => tkr.id === ikr.linkedTeamKRId);
          if (hasTeamKR) {
            for (const orgKRId of obj.linkedOrgKRIds) {
              linkedOrgKRIds.add(orgKRId);
            }
          }
        }
      }
    }
  }

  const teammates = data.individuals.filter((p) => p.id !== person.id && p.teamId === person.teamId);

  return (
    <>
      <span className="detail-type-badge" style={{ backgroundColor: getTeamColor(person.teamId), color: 'white' }}>
        Individual
      </span>
      <div className="detail-title">{person.name}</div>
      {person.role && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{person.role}</div>}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
        Team: <strong>{team?.name}</strong>
      </div>

      {h1KRs.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">H1 Key Results ({h1KRs.length})</div>
          {h1KRs.map((kr) => (
            <div key={kr.id} className="detail-kr-item" style={{ borderLeftColor: getTeamColor(person.teamId) }}>
              {kr.title}
            </div>
          ))}
        </div>
      )}

      {h2KRs.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">H2 Key Results ({h2KRs.length})</div>
          {h2KRs.map((kr) => (
            <div key={kr.id} className="detail-kr-item" style={{ borderLeftColor: getTeamColor(person.teamId) }}>
              {kr.title}
            </div>
          ))}
        </div>
      )}

      <div className="detail-section">
        <div className="detail-section-title">Contributing to Org KRs ({linkedOrgKRIds.size})</div>
        {Array.from(linkedOrgKRIds).map((orgKRId) => {
          const orgKR = data.orgObjectives.flatMap((o) => o.keyResults).find((kr) => kr.id === orgKRId);
          return orgKR ? (
            <div key={orgKRId} className="detail-link-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: orgKRId })}>
              {orgKR.title}
            </div>
          ) : null;
        })}
      </div>

      {teammates.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Teammates</div>
          {teammates.map((t) => (
            <div key={t.id} className="detail-link-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: t.id })}>
              {t.name} ({t.keyResults.length} KRs)
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TeamKRDetail({ tkr, data, dispatch }: { tkr: { kr: { id: string; title: string }; teamName: string; teamId: string }; data: OKRData; dispatch: Dispatch }) {
  // Find org KRs via the parent team objective's linkedOrgKRIds
  const linkedOrgKRs: { id: string; title: string }[] = [];
  for (const team of data.teams) {
    for (const obj of team.objectives) {
      const hasThisKR = obj.keyResults.some((kr) => kr.id === tkr.kr.id);
      if (hasThisKR) {
        for (const orgKRId of obj.linkedOrgKRIds) {
          const orgKR = data.orgObjectives.flatMap((o) => o.keyResults).find((kr) => kr.id === orgKRId);
          if (orgKR) linkedOrgKRs.push(orgKR);
        }
      }
    }
  }

  const contributors = data.individuals.filter((p) =>
    p.keyResults.some((ikr) => ikr.linkedTeamKRId === tkr.kr.id)
  );

  return (
    <>
      <span className="detail-type-badge" style={{ backgroundColor: getTeamColor(tkr.teamId), color: 'white' }}>
        Team KR
      </span>
      <div className="detail-title">{tkr.kr.title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
        Team: <strong>{tkr.teamName}</strong>
      </div>
      {linkedOrgKRs.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Feeds into Org KRs ({linkedOrgKRs.length})</div>
          {linkedOrgKRs.map((orgKR) => (
            <div key={orgKR.id} className="detail-link-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: orgKR.id })}>
              {orgKR.title}
            </div>
          ))}
        </div>
      )}
      <div className="detail-section">
        <div className="detail-section-title">Contributors ({contributors.length})</div>
        {contributors.map((p) => (
          <div key={p.id} className="detail-link-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: p.id })}>
            {p.name} ({p.keyResults.filter((kr) => kr.linkedTeamKRId === tkr.kr.id).length} KRs)
          </div>
        ))}
      </div>
    </>
  );
}

function IndKRDetail({ ikr, data, dispatch }: { ikr: { id: string; title: string; personName: string; teamId: string; linkedTeamKRId: string | null; period: string }; data: OKRData; dispatch: Dispatch }) {
  return (
    <>
      <span className="detail-type-badge" style={{ backgroundColor: getTeamColor(ikr.teamId), color: 'white' }}>
        Individual KR
      </span>
      <div className="detail-title">{ikr.title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
        By: <strong>{ikr.personName}</strong>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
        Period: {ikr.period}
      </div>
      {ikr.linkedTeamKRId && (() => {
        let teamKRTitle = '';
        for (const team of data.teams) {
          for (const obj of team.objectives) {
            for (const tkr of obj.keyResults) {
              if (tkr.id === ikr.linkedTeamKRId) teamKRTitle = tkr.title;
            }
          }
        }
        return teamKRTitle ? (
          <div className="detail-section">
            <div className="detail-section-title">Linked Team KR</div>
            <div className="detail-link-item" onClick={() => dispatch({ type: 'SET_SELECTED_NODE', payload: ikr.linkedTeamKRId! })}>
              {teamKRTitle}
            </div>
          </div>
        ) : null;
      })()}
    </>
  );
}
