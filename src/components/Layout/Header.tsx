import { useOKR } from '../../context/OKRContext';
import type { ViewMode } from '../../types/okr';

const views: { mode: ViewMode; label: string }[] = [
  { mode: 'network', label: 'Network' },
  { mode: 'hierarchy', label: 'Hierarchy' },
  { mode: 'matrix', label: 'Contribution Matrix' },
  { mode: 'sankey', label: 'Flow' },
];

export default function Header() {
  const { state, dispatch } = useOKR();

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          Treekr
        </div>
        <div className="view-tabs">
          {views.map((v) => (
            <button
              key={v.mode}
              className={`view-tab ${state.viewMode === v.mode ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: v.mode })}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="header-right">
        <button className="btn" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
          Reset Filters
        </button>
        <button
          id="add-okr-btn"
          className="btn btn-primary"
          onClick={() => dispatch({ type: 'OPEN_OKR_EDITOR' })}
        >
          + Add OKR
        </button>
        <button className="btn" onClick={() => dispatch({ type: 'TOGGLE_DATA_INPUT' })}>
          Load Data
        </button>
      </div>
    </header>
  );
}
