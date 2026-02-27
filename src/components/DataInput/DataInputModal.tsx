import { useState } from 'react';
import { useOKR } from '../../context/OKRContext';
import { parseOKRText } from '../../data/parser';
import { sampleInputText } from '../../data/sampleData';

export default function DataInputModal() {
  const { state, dispatch } = useOKR();
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{
    orgObjectives: number;
    orgKRs: number;
    teams: number;
    teamKRs: number;
    individuals: number;
    individualKRs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!state.showDataInput) return null;

  const handleParse = () => {
    try {
      setError(null);
      const parsed = parseOKRText(text);
      setPreview({
        orgObjectives: parsed.orgObjectives.length,
        orgKRs: parsed.orgObjectives.reduce((s, o) => s + o.keyResults.length, 0),
        teams: parsed.teams.length,
        teamKRs: parsed.teams.reduce(
          (s, t) => s + t.objectives.reduce((s2, o) => s2 + o.keyResults.length, 0),
          0
        ),
        individuals: parsed.individuals.length,
        individualKRs: parsed.individuals.reduce((s, p) => s + p.keyResults.length, 0),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Parse error');
      setPreview(null);
    }
  };

  const handleLoad = () => {
    try {
      setError(null);
      const parsed = parseOKRText(text);
      dispatch({ type: 'SET_DATA', payload: parsed });
      dispatch({ type: 'TOGGLE_DATA_INPUT' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Parse error');
    }
  };

  const handleLoadSample = () => {
    setText(sampleInputText);
  };

  const close = () => dispatch({ type: 'TOGGLE_DATA_INPUT' });

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Load OKR Data</h2>
          <button className="detail-panel-close" onClick={close}>&times;</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
            Paste your OKR data in the structured text format below. Use{' '}
            <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}>
              === ORGANIZATION ===
            </code>,{' '}
            <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}>
              === TEAM: Name | Type: country ===
            </code>, and{' '}
            <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}>
              === INDIVIDUAL: Name | Team: TeamName | Period: H1 2025 ===
            </code>{' '}
            headers. Use{' '}
            <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}>
              -&gt; [Org KR: ...]
            </code>{' '}
            or{' '}
            <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: 3, fontSize: 12 }}>
              -&gt; [Team KR: ...]
            </code>{' '}
            to link KRs.
          </p>
          <textarea
            className="data-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your OKR data here..."
          />
          {error && (
            <div style={{ marginTop: 8, padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 6, color: '#EF4444', fontSize: 12 }}>
              {error}
            </div>
          )}
          {preview && (
            <div className="parse-preview">
              <span className="stat">
                <strong>{preview.orgObjectives}</strong> Org Objectives
              </span>
              <span className="stat">
                <strong>{preview.orgKRs}</strong> Org KRs
              </span>
              <span className="stat">
                <strong>{preview.teams}</strong> Teams
              </span>
              <span className="stat">
                <strong>{preview.teamKRs}</strong> Team KRs
              </span>
              <span className="stat">
                <strong>{preview.individuals}</strong> People
              </span>
              <span className="stat">
                <strong>{preview.individualKRs}</strong> Individual KRs
              </span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={handleLoadSample}>
            Load Sample
          </button>
          <button className="btn" onClick={handleParse}>
            Preview
          </button>
          <button className="btn btn-primary" onClick={handleLoad} disabled={!text.trim()}>
            Load Data
          </button>
        </div>
      </div>
    </div>
  );
}
