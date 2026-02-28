import { useState, useId } from 'react';
import { useOKR } from '../../context/OKRContext';
import type {
    OrgObjective,
    OrgKeyResult,
    Team,
    TeamObjective,
    TeamKeyResult,
    Individual,
    IndividualKeyResult,
} from '../../types/okr';

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type EntityType = 'org' | 'team' | 'individual';
type Step = 1 | 2 | 3;

// ── Step-indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
    const labels = ['Entity', 'Objective', 'Key Result'];
    return (
        <div className="wizard-steps">
            {labels.map((label, i) => {
                const step = (i + 1) as Step;
                const state = step < current ? 'done' : step === current ? 'active' : 'upcoming';
                return (
                    <div key={step} className={`wizard-step wizard-step--${state}`}>
                        <span className="wizard-step__dot">{step < current ? '✓' : step}</span>
                        <span className="wizard-step__label">{label}</span>
                        {i < labels.length - 1 && <span className="wizard-step__line" />}
                    </div>
                );
            })}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OKREditorModal() {
    const { state, dispatch } = useOKR();
    const { data, showOKREditor } = state;
    const baseId = useId();

    // ── Step 1 state ─────────────────────────────────────────────────────────
    const [step, setStep] = useState<Step>(1);
    const [entityType, setEntityType] = useState<EntityType>('org');

    // team selection / creation
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamType, setNewTeamType] = useState<'country' | 'technical' | 'thematic'>('country');

    // individual selection / creation
    const [selectedIndividualId, setSelectedIndividualId] = useState('');
    const [newIndividualName, setNewIndividualName] = useState('');
    const [newIndividualRole, setNewIndividualRole] = useState('');
    const [newIndividualTeamId, setNewIndividualTeamId] = useState('');

    // ── Step 2 state ─────────────────────────────────────────────────────────
    const [selectedObjectiveId, setSelectedObjectiveId] = useState('');
    const [newObjectiveTitle, setNewObjectiveTitle] = useState('');

    // ── Step 3 state ─────────────────────────────────────────────────────────
    const [krTitle, setKrTitle] = useState('');
    const [linkedTeamKRId, setLinkedTeamKRId] = useState('');
    const [krPeriod, setKrPeriod] = useState<'H1' | 'H2'>('H1');
    const [krYear, setKrYear] = useState(2026);

    const [error, setError] = useState('');

    if (!showOKREditor) return null;

    const close = () => {
        dispatch({ type: 'CLOSE_OKR_EDITOR' });
        resetAll();
    };

    function resetAll() {
        setStep(1);
        setEntityType('org');
        setSelectedTeamId('');
        setNewTeamName('');
        setNewTeamType('country');
        setSelectedIndividualId('');
        setNewIndividualName('');
        setNewIndividualRole('');
        setNewIndividualTeamId('');
        setSelectedObjectiveId('');
        setNewObjectiveTitle('');
        setKrTitle('');
        setLinkedTeamKRId('');
        setKrPeriod('H1');
        setKrYear(2026);
        setError('');
    }

    // ── Derived helpers ───────────────────────────────────────────────────────

    const isCreatingTeam = entityType === 'team' && selectedTeamId === '__new__';
    const isCreatingIndividual = entityType === 'individual' && selectedIndividualId === '__new__';

    const resolvedTeamId = isCreatingTeam
        ? uid('team')
        : selectedTeamId;

    const resolvedIndividualId = isCreatingIndividual
        ? uid('ind')
        : selectedIndividualId;

    const resolvedIndividualTeamId: string = (() => {
        if (isCreatingIndividual) return newIndividualTeamId;
        const found = data.individuals.find((i) => i.id === selectedIndividualId);
        return found?.teamId ?? '';
    })();

    // Objectives shown in step 2
    const existingObjectives: { id: string; title: string }[] = (() => {
        if (entityType === 'org') {
            return data.orgObjectives.map((o) => ({ id: o.id, title: o.title }));
        }
        if (entityType === 'team') {
            const team = data.teams.find((t) => t.id === selectedTeamId);
            return team?.objectives.map((o) => ({ id: o.id, title: o.title })) ?? [];
        }
        // For individual KRs there's no separate objective step — jump straight to KR
        return [];
    })();

    // All team KRs in the individual's team (for linking)
    const teamKRsForLinking: { id: string; title: string; objectiveTitle: string }[] = (() => {
        const team = data.teams.find((t) => t.id === resolvedIndividualTeamId);
        if (!team) return [];
        return team.objectives.flatMap((obj) =>
            obj.keyResults.map((kr) => ({
                id: kr.id,
                title: kr.title,
                objectiveTitle: obj.title,
            }))
        );
    })();

    // ── Validation ────────────────────────────────────────────────────────────

    function validateStep1(): string {
        if (entityType === 'team') {
            if (!selectedTeamId) return 'Please select a team or choose to create a new one.';
            if (isCreatingTeam && !newTeamName.trim()) return 'Please enter a name for the new team.';
        }
        if (entityType === 'individual') {
            if (!selectedIndividualId)
                return 'Please select an individual or choose to create a new one.';
            if (isCreatingIndividual) {
                if (!newIndividualName.trim()) return 'Please enter the individual\'s name.';
                if (!newIndividualTeamId) return 'Please select a team for the new individual.';
            }
        }
        return '';
    }

    function validateStep2(): string {
        // Individual KRs skip this step
        if (entityType === 'individual') return '';
        if (!selectedObjectiveId && !newObjectiveTitle.trim())
            return 'Please select an existing objective or enter a new one.';
        return '';
    }

    function validateStep3(): string {
        if (!krTitle.trim()) return 'Please enter the Key Result title.';
        return '';
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    const goNext = () => {
        setError('');
        if (step === 1) {
            const err = validateStep1();
            if (err) { setError(err); return; }
            // Individuals skip step 2 (no team-objective concept)
            setStep(entityType === 'individual' ? 3 : 2);
        } else if (step === 2) {
            const err = validateStep2();
            if (err) { setError(err); return; }
            setStep(3);
        }
    };

    const goBack = () => {
        setError('');
        if (step === 3 && entityType === 'individual') setStep(1);
        else if (step > 1) setStep((s) => (s - 1) as Step);
    };

    // ── Save ──────────────────────────────────────────────────────────────────

    const handleSave = () => {
        const err = validateStep3();
        if (err) { setError(err); return; }

        if (entityType === 'org') {
            saveOrgKR();
        } else if (entityType === 'team') {
            saveTeamKR();
        } else {
            saveIndividualKR();
        }

        close();
    };

    function saveOrgKR() {
        // Resolve or create objective
        let objectiveId = selectedObjectiveId;
        if (!objectiveId) {
            const newObj: OrgObjective = {
                id: uid('org-obj'),
                title: newObjectiveTitle.trim(),
                keyResults: [],
            };
            dispatch({ type: 'ADD_ORG_OBJECTIVE', payload: newObj });
            objectiveId = newObj.id;
        }
        const kr: OrgKeyResult = {
            id: uid('org-kr'),
            objectiveId,
            title: krTitle.trim(),
        };
        dispatch({ type: 'ADD_ORG_KR', payload: { objectiveId, kr } });
    }

    function saveTeamKR() {
        let teamId = selectedTeamId;

        // Create new team if needed
        if (isCreatingTeam) {
            teamId = resolvedTeamId;
            const newTeam: Team = {
                id: teamId,
                name: newTeamName.trim(),
                type: newTeamType,
                objectives: [],
            };
            dispatch({ type: 'ADD_TEAM', payload: newTeam });
        }

        // Resolve or create objective
        let objectiveId = selectedObjectiveId;
        if (!objectiveId) {
            const newObj: TeamObjective = {
                id: uid('team-obj'),
                teamId,
                title: newObjectiveTitle.trim(),
                keyResults: [],
                linkedOrgKRIds: [],
            };
            dispatch({ type: 'ADD_TEAM_OBJECTIVE', payload: { teamId, objective: newObj } });
            objectiveId = newObj.id;
        }

        const kr: TeamKeyResult = {
            id: uid('team-kr'),
            objectiveId,
            teamId,
            title: krTitle.trim(),
        };
        dispatch({ type: 'ADD_TEAM_KR', payload: { teamId, objectiveId, kr } });
    }

    function saveIndividualKR() {
        let individualId = selectedIndividualId;

        // Create new individual if needed
        if (isCreatingIndividual) {
            individualId = resolvedIndividualId;
            const newInd: Individual = {
                id: individualId,
                name: newIndividualName.trim(),
                teamId: newIndividualTeamId,
                role: newIndividualRole.trim() || undefined,
                keyResults: [],
            };
            dispatch({ type: 'ADD_INDIVIDUAL', payload: newInd });
        }

        const kr: IndividualKeyResult = {
            id: uid('ind-kr'),
            individualId,
            title: krTitle.trim(),
            period: krPeriod,
            year: krYear,
            linkedTeamKRId: linkedTeamKRId || null,
        };
        dispatch({ type: 'ADD_INDIVIDUAL_KR', payload: { individualId, kr } });
    }

    // ── Render helpers ────────────────────────────────────────────────────────

    const sectionLabel = (label: string) => (
        <div className="editor-field-label">{label}</div>
    );

    const renderStep1 = () => (
        <div className="wizard-body">
            <div className="editor-entity-tabs">
                {(['org', 'team', 'individual'] as EntityType[]).map((t) => (
                    <button
                        key={t}
                        id={`${baseId}-entity-${t}`}
                        className={`editor-entity-tab ${entityType === t ? 'active' : ''}`}
                        onClick={() => {
                            setEntityType(t);
                            setSelectedTeamId('');
                            setSelectedIndividualId('');
                        }}
                    >
                        {t === 'org' ? '🏢 Organization' : t === 'team' ? '👥 Team' : '👤 Individual'}
                    </button>
                ))}
            </div>

            {entityType === 'team' && (
                <div className="editor-fields">
                    {sectionLabel('Select team')}
                    <select
                        id={`${baseId}-team-select`}
                        className="editor-select"
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                    >
                        <option value="">— choose —</option>
                        {data.teams.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name} ({t.type})
                            </option>
                        ))}
                        <option value="__new__">＋ Create new team…</option>
                    </select>

                    {isCreatingTeam && (
                        <>
                            {sectionLabel('Team name')}
                            <input
                                id={`${baseId}-team-name`}
                                className="editor-input"
                                placeholder="e.g. Malawi"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                            />
                            {sectionLabel('Team type')}
                            <select
                                id={`${baseId}-team-type`}
                                className="editor-select"
                                value={newTeamType}
                                onChange={(e) =>
                                    setNewTeamType(e.target.value as 'country' | 'technical' | 'thematic')
                                }
                            >
                                <option value="country">Country</option>
                                <option value="technical">Technical</option>
                                <option value="thematic">Thematic</option>
                            </select>
                        </>
                    )}
                </div>
            )}

            {entityType === 'individual' && (
                <div className="editor-fields">
                    {sectionLabel('Select individual')}
                    <select
                        id={`${baseId}-ind-select`}
                        className="editor-select"
                        value={selectedIndividualId}
                        onChange={(e) => setSelectedIndividualId(e.target.value)}
                    >
                        <option value="">— choose —</option>
                        {data.individuals.map((ind) => {
                            const team = data.teams.find((t) => t.id === ind.teamId);
                            return (
                                <option key={ind.id} value={ind.id}>
                                    {ind.name}{team ? ` (${team.name})` : ''}
                                </option>
                            );
                        })}
                        <option value="__new__">＋ Create new individual…</option>
                    </select>

                    {isCreatingIndividual && (
                        <>
                            {sectionLabel('Full name')}
                            <input
                                id={`${baseId}-ind-name`}
                                className="editor-input"
                                placeholder="e.g. Jane Doe"
                                value={newIndividualName}
                                onChange={(e) => setNewIndividualName(e.target.value)}
                            />
                            {sectionLabel('Role (optional)')}
                            <input
                                id={`${baseId}-ind-role`}
                                className="editor-input"
                                placeholder="e.g. Program Officer"
                                value={newIndividualRole}
                                onChange={(e) => setNewIndividualRole(e.target.value)}
                            />
                            {sectionLabel('Team')}
                            <select
                                id={`${baseId}-ind-team`}
                                className="editor-select"
                                value={newIndividualTeamId}
                                onChange={(e) => setNewIndividualTeamId(e.target.value)}
                            >
                                <option value="">— choose team —</option>
                                {data.teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            )}

            {entityType === 'org' && (
                <p className="editor-hint">
                    You'll add a Key Result to an existing Organizational Objective, or create a new one.
                </p>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="wizard-body">
            <p className="editor-section-heading">
                {entityType === 'team'
                    ? `Objective for: ${isCreatingTeam ? newTeamName || 'new team' : data.teams.find((t) => t.id === selectedTeamId)?.name}`
                    : 'Organizational Objective'}
            </p>

            {existingObjectives.length > 0 && (
                <>
                    {sectionLabel('Select existing objective')}
                    <div className="editor-obj-list">
                        {existingObjectives.map((obj) => (
                            <button
                                key={obj.id}
                                className={`editor-obj-item ${selectedObjectiveId === obj.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedObjectiveId(obj.id);
                                    setNewObjectiveTitle('');
                                }}
                            >
                                {obj.title}
                            </button>
                        ))}
                    </div>
                    <div className="editor-divider">or add a new objective</div>
                </>
            )}

            {sectionLabel('New objective title')}
            <textarea
                id={`${baseId}-obj-title`}
                className="editor-textarea"
                rows={3}
                placeholder="Describe the objective…"
                value={newObjectiveTitle}
                onChange={(e) => {
                    setNewObjectiveTitle(e.target.value);
                    if (e.target.value) setSelectedObjectiveId('');
                }}
            />
        </div>
    );

    const renderStep3 = () => (
        <div className="wizard-body">
            <p className="editor-section-heading">
                {entityType === 'org'
                    ? `KR for Org Objective: ${selectedObjectiveId
                        ? data.orgObjectives.find((o) => o.id === selectedObjectiveId)?.title
                        : newObjectiveTitle
                    }`
                    : entityType === 'team'
                        ? `KR for ${isCreatingTeam ? newTeamName : data.teams.find((t) => t.id === selectedTeamId)?.name}`
                        : `KR for ${isCreatingIndividual ? newIndividualName : data.individuals.find((i) => i.id === selectedIndividualId)?.name}`}
            </p>

            {sectionLabel('Key Result')}
            <textarea
                id={`${baseId}-kr-title`}
                className="editor-textarea"
                rows={4}
                placeholder="Describe the measurable outcome…"
                value={krTitle}
                onChange={(e) => setKrTitle(e.target.value)}
            />

            {/* Individual KR: link to Team KR */}
            {entityType === 'individual' && (
                <>
                    {sectionLabel('Links to Team KR (optional)')}
                    <select
                        id={`${baseId}-link-team-kr`}
                        className="editor-select"
                        value={linkedTeamKRId}
                        onChange={(e) => setLinkedTeamKRId(e.target.value)}
                    >
                        <option value="">— none —</option>
                        {teamKRsForLinking.map((kr) => (
                            <option key={kr.id} value={kr.id}>
                                [{kr.objectiveTitle.slice(0, 30)}…] {kr.title.slice(0, 55)}…
                            </option>
                        ))}
                    </select>

                    <div className="editor-period-row">
                        <div style={{ flex: 1 }}>
                            {sectionLabel('Period')}
                            <div className="editor-period-btns">
                                {(['H1', 'H2'] as const).map((p) => (
                                    <button
                                        key={p}
                                        id={`${baseId}-period-${p}`}
                                        className={`period-btn ${krPeriod === p ? 'active' : ''}`}
                                        onClick={() => setKrPeriod(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {sectionLabel('Year')}
                            <input
                                id={`${baseId}-year`}
                                type="number"
                                className="editor-input"
                                value={krYear}
                                min={2024}
                                max={2030}
                                onChange={(e) => setKrYear(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal editor-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Key Result</h2>
                    <button className="detail-panel-close" onClick={close}>
                        &times;
                    </button>
                </div>

                <StepIndicator current={step} />

                <div className="modal-body editor-modal-body">
                    {error && (
                        <div className="editor-error">{error}</div>
                    )}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>

                <div className="modal-footer">
                    {step > 1 && (
                        <button className="btn" onClick={goBack}>
                            ← Back
                        </button>
                    )}
                    <span style={{ flex: 1 }} />
                    {step < 3 ? (
                        <button className="btn btn-primary" onClick={goNext}>
                            Next →
                        </button>
                    ) : (
                        <button
                            id="okr-editor-save-btn"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!krTitle.trim()}
                        >
                            Save KR
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
