import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  OKRData,
  ViewMode,
  FilterState,
  OrgObjective,
  OrgKeyResult,
  Team,
  TeamObjective,
  TeamKeyResult,
  Individual,
  IndividualKeyResult,
} from '../types/okr';
import { loadData, saveData } from '../hooks/useOKRStorage';

interface State {
  data: OKRData;
  viewMode: ViewMode;
  filters: FilterState;
  showDataInput: boolean;
  showOKREditor: boolean;
}

type Action =
  | { type: 'SET_DATA'; payload: OKRData }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SELECTED_TEAMS'; payload: string[] }
  | { type: 'SET_SELECTED_PERIOD'; payload: 'all' | 'H1' | 'H2' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_HIGHLIGHTED_NODE'; payload: string | null }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'TOGGLE_DATA_INPUT' }
  | { type: 'OPEN_OKR_EDITOR' }
  | { type: 'CLOSE_OKR_EDITOR' }
  | { type: 'RESET_FILTERS' }
  // Org-level mutations
  | { type: 'ADD_ORG_OBJECTIVE'; payload: OrgObjective }
  | { type: 'ADD_ORG_KR'; payload: { objectiveId: string; kr: OrgKeyResult } }
  | { type: 'UPDATE_ORG_KR'; payload: { objectiveId: string; kr: OrgKeyResult } }
  // Team-level mutations
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'ADD_TEAM_OBJECTIVE'; payload: { teamId: string; objective: TeamObjective } }
  | { type: 'ADD_TEAM_KR'; payload: { teamId: string; objectiveId: string; kr: TeamKeyResult } }
  | { type: 'UPDATE_TEAM_KR'; payload: { teamId: string; objectiveId: string; kr: TeamKeyResult } }
  // Individual-level mutations
  | { type: 'ADD_INDIVIDUAL'; payload: Individual }
  | { type: 'ADD_INDIVIDUAL_KR'; payload: { individualId: string; kr: IndividualKeyResult } }
  | { type: 'UPDATE_INDIVIDUAL_KR'; payload: { individualId: string; kr: IndividualKeyResult } };

const initialState: State = {
  data: loadData(),
  viewMode: 'network',
  filters: {
    selectedTeams: [],
    selectedPeriod: 'all',
    selectedYear: null,
    searchQuery: '',
    highlightedNodeId: null,
    selectedNodeId: null,
  },
  showDataInput: false,
  showOKREditor: false,
};

function mutateData(state: State, updater: (data: OKRData) => OKRData): State {
  const newData = updater(state.data);
  saveData(newData);
  return { ...state, data: newData };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DATA': {
      saveData(action.payload);
      return {
        ...state,
        data: action.payload,
        filters: { ...state.filters, selectedNodeId: null, highlightedNodeId: null },
      };
    }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SELECTED_TEAMS':
      return { ...state, filters: { ...state.filters, selectedTeams: action.payload } };
    case 'SET_SELECTED_PERIOD':
      return { ...state, filters: { ...state.filters, selectedPeriod: action.payload } };
    case 'SET_SEARCH_QUERY':
      return { ...state, filters: { ...state.filters, searchQuery: action.payload } };
    case 'SET_HIGHLIGHTED_NODE':
      return { ...state, filters: { ...state.filters, highlightedNodeId: action.payload } };
    case 'SET_SELECTED_NODE':
      return { ...state, filters: { ...state.filters, selectedNodeId: action.payload } };
    case 'TOGGLE_DATA_INPUT':
      return { ...state, showDataInput: !state.showDataInput };
    case 'OPEN_OKR_EDITOR':
      return { ...state, showOKREditor: true };
    case 'CLOSE_OKR_EDITOR':
      return { ...state, showOKREditor: false };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };

    // ── Org mutations ──────────────────────────────────
    case 'ADD_ORG_OBJECTIVE':
      return mutateData(state, (d) => ({
        ...d,
        orgObjectives: [...d.orgObjectives, action.payload],
      }));
    case 'ADD_ORG_KR':
      return mutateData(state, (d) => ({
        ...d,
        orgObjectives: d.orgObjectives.map((obj) =>
          obj.id === action.payload.objectiveId
            ? { ...obj, keyResults: [...obj.keyResults, action.payload.kr] }
            : obj
        ),
      }));
    case 'UPDATE_ORG_KR':
      return mutateData(state, (d) => ({
        ...d,
        orgObjectives: d.orgObjectives.map((obj) =>
          obj.id === action.payload.objectiveId
            ? {
              ...obj,
              keyResults: obj.keyResults.map((kr) =>
                kr.id === action.payload.kr.id ? action.payload.kr : kr
              ),
            }
            : obj
        ),
      }));

    // ── Team mutations ─────────────────────────────────
    case 'ADD_TEAM':
      return mutateData(state, (d) => ({ ...d, teams: [...d.teams, action.payload] }));
    case 'ADD_TEAM_OBJECTIVE':
      return mutateData(state, (d) => ({
        ...d,
        teams: d.teams.map((t) =>
          t.id === action.payload.teamId
            ? { ...t, objectives: [...t.objectives, action.payload.objective] }
            : t
        ),
      }));
    case 'ADD_TEAM_KR':
      return mutateData(state, (d) => ({
        ...d,
        teams: d.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
              ...t,
              objectives: t.objectives.map((obj) =>
                obj.id === action.payload.objectiveId
                  ? { ...obj, keyResults: [...obj.keyResults, action.payload.kr] }
                  : obj
              ),
            }
            : t
        ),
      }));
    case 'UPDATE_TEAM_KR':
      return mutateData(state, (d) => ({
        ...d,
        teams: d.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
              ...t,
              objectives: t.objectives.map((obj) =>
                obj.id === action.payload.objectiveId
                  ? {
                    ...obj,
                    keyResults: obj.keyResults.map((kr) =>
                      kr.id === action.payload.kr.id ? action.payload.kr : kr
                    ),
                  }
                  : obj
              ),
            }
            : t
        ),
      }));

    // ── Individual mutations ───────────────────────────
    case 'ADD_INDIVIDUAL':
      return mutateData(state, (d) => ({
        ...d,
        individuals: [...d.individuals, action.payload],
      }));
    case 'ADD_INDIVIDUAL_KR':
      return mutateData(state, (d) => ({
        ...d,
        individuals: d.individuals.map((ind) =>
          ind.id === action.payload.individualId
            ? { ...ind, keyResults: [...ind.keyResults, action.payload.kr] }
            : ind
        ),
      }));
    case 'UPDATE_INDIVIDUAL_KR':
      return mutateData(state, (d) => ({
        ...d,
        individuals: d.individuals.map((ind) =>
          ind.id === action.payload.individualId
            ? {
              ...ind,
              keyResults: ind.keyResults.map((kr) =>
                kr.id === action.payload.kr.id ? action.payload.kr : kr
              ),
            }
            : ind
        ),
      }));

    default:
      return state;
  }
}

interface OKRContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const OKRContext = createContext<OKRContextValue | null>(null);

export function OKRProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <OKRContext.Provider value={{ state, dispatch }}>{children}</OKRContext.Provider>;
}

export function useOKR(): OKRContextValue {
  const ctx = useContext(OKRContext);
  if (!ctx) throw new Error('useOKR must be used within OKRProvider');
  return ctx;
}
