// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { createEngineer, submitEvaluation, getEngineers, setAuthToken } from '../../api/nexusApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Engineer, Level, Track, CapabilityCode } from '../../types/domain';
import { CAPABILITIES } from '../../config/capabilities';
import { CapabilitySlider } from '../../components/forms/CapabilitySlider';
import './AddEmployee.css';

interface AddEmployeeProps {
    onSuccess?: (engineer: Engineer) => void;
    onCancel?: () => void;
}

interface FormData {
    name: string;
    email: string;
    team: string;
    track: Track | '';
    currentLevel: Level | '';
    managerId: string;
    joinDate: string;
    capabilities: Record<CapabilityCode, number>;
    notes: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    team?: string;
    track?: string;
    currentLevel?: string;
}

const COMMON_TEAMS = [
    'Platform Engineering', 'Backend Engineering', 'Frontend Engineering',
    'Full Stack Engineering', 'Infrastructure', 'DevOps', 'SRE (Site Reliability)',
    'Security Engineering', 'Data Engineering', 'AI/ML', 'Mobile Engineering',
    'iOS Engineering', 'Android Engineering', 'QA Engineering', 'Test Engineering',
    'Product Engineering', 'API Engineering', 'Cloud Engineering', 'Database Engineering',
    'Network Engineering', 'Systems Engineering', 'Research & Development',
    'Developer Experience', 'Observability', 'Performance Engineering',
];

export const AddEmployee: React.FC<AddEmployeeProps> = ({ onSuccess, onCancel }) => {
    const { token, user } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        team: '',
        track: '',
        currentLevel: '',
        managerId: '',
        joinDate: new Date().toISOString().split('T')[0],
        capabilities: {
            SYSTEM_DESIGN: 0, TECHNICAL_DEPTH: 0, CODE_OWNERSHIP: 0,
            DEBUGGING: 0, COMMUNICATION: 0, PRODUCT_THINKING: 0,
            EXECUTION: 0, MENTORSHIP: 0, ARCHITECTURE_VISION: 0
        },
        notes: ''
    });

    const [managers, setManagers] = useState<Engineer[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    // Sync auth token and load managers from API
    useEffect(() => {
        if (token) {
            setAuthToken(token);
            getEngineers().then(res => {
                if (res.success && res.data) {
                    setManagers(res.data);
                }
            }).catch(() => {
                // managers dropdown is optional, ignore error
            });
        }
    }, [token]);

    const ratedCount = useMemo(() =>
        Object.values(formData.capabilities).filter(r => r > 0).length,
        [formData.capabilities]
    );

    const handleCapabilityChange = (code: CapabilityCode, value: number) => {
        setFormData(prev => ({
            ...prev,
            capabilities: { ...prev.capabilities, [code]: value }
        }));
    };

    // Validation
    const validateName = (v: string) => {
        if (!v.trim()) return 'Name is required';
        if (v.trim().length < 2) return 'Name must be at least 2 characters';
        if (v.trim().length > 100) return 'Name cannot exceed 100 characters';
    };
    const validateEmail = (v: string) => {
        if (!v.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    };
    const validateTeam = (v: string) => {
        if (!v.trim()) return 'Team is required';
        if (v.trim().length < 2) return 'Team name must be at least 2 characters';
    };
    const validateTrack = (v: string) => { if (!v) return 'Please select a track'; };
    const validateLevel = (v: string) => { if (!v) return 'Please select a level'; };

    const validateField = (field: keyof FormData, value: string) => {
        let error: string | undefined;
        if (field === 'name') error = validateName(value);
        else if (field === 'email') error = validateEmail(value);
        else if (field === 'team') error = validateTeam(value);
        else if (field === 'track') error = validateTrack(value);
        else if (field === 'currentLevel') error = validateLevel(value);
        setErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    const isFormValid = useMemo(() => (
        !errors.name && !errors.email && !errors.team && !errors.track && !errors.currentLevel &&
        formData.name.trim() !== '' && formData.email.trim() !== '' &&
        formData.team.trim() !== '' && formData.track !== '' && formData.currentLevel !== ''
    ), [errors, formData]);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSubmitError(null);
        setSubmitSuccess(null);
        if (['name', 'email', 'team', 'track', 'currentLevel'].includes(field as string)) {
            validateField(field, value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok =
            validateField('name', formData.name) &&
            validateField('email', formData.email) &&
            validateField('team', formData.team) &&
            validateField('track', formData.track) &&
            validateField('currentLevel', formData.currentLevel);

        if (!ok) { setSubmitError('Please fix all errors before submitting'); return; }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            if (token) setAuthToken(token);

            const engineerData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                track: formData.track as Track,
                currentLevel: formData.currentLevel as Level,
                team: formData.team.trim(),
                managerId: formData.managerId || undefined,
            };

            const engineerRes = await createEngineer(engineerData);

            if (!engineerRes.success || !engineerRes.data) {
                setSubmitError(engineerRes.error?.message || 'Failed to create engineer. Please try again.');
                setIsSubmitting(false);
                return;
            }

            const newEngineer = engineerRes.data;
            console.log('✅ Engineer created:', newEngineer);

            // Submit initial capability snapshot if any ratings were given
            const hasRatings = Object.values(formData.capabilities).some(r => r > 0);
            if (hasRatings) {
                const snapshotData = {
                    engineerId: Number(newEngineer.id),
                    evaluatorId: user?.email || 'SYSTEM',
                    capabilities: formData.capabilities,
                    notes: formData.notes || undefined
                };
                const snapRes = await submitEvaluation(snapshotData);
                if (!snapRes.success) {
                    console.warn('⚠️ Initial snapshot failed:', snapRes.error);
                } else {
                    console.log('✅ Initial snapshot saved');
                }
            }

            setSubmitSuccess(`✅ ${newEngineer.name} added successfully! (ID: ${newEngineer.id})`);

            // Reset form
            setFormData({
                name: '', email: '', team: '', track: '', currentLevel: '',
                managerId: '', joinDate: new Date().toISOString().split('T')[0],
                capabilities: {
                    SYSTEM_DESIGN: 0, TECHNICAL_DEPTH: 0, CODE_OWNERSHIP: 0,
                    DEBUGGING: 0, COMMUNICATION: 0, PRODUCT_THINKING: 0,
                    EXECUTION: 0, MENTORSHIP: 0, ARCHITECTURE_VISION: 0
                },
                notes: ''
            });
            setErrors({});
            setIsSubmitting(false);

            // Navigate to new employee's profile after short delay
            setTimeout(() => { onSuccess?.(newEngineer); }, 1200);

        } catch (err) {
            console.error('Error creating employee:', err);
            setSubmitError('Unexpected error. Please check your connection and try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-employee-page">
            <div className="add-employee-header">
                <h1>➕ New Employee</h1>
                <p className="add-employee-subtitle">Add a new engineer to the system</p>
            </div>

            <form className="add-employee-form" onSubmit={handleSubmit}>

                {/* Basic Information */}
                <section className="form-section">
                    <label className="section-label">👤 Basic Information</label>

                    <div className="form-field">
                        <label htmlFor="name" className="field-label">Name <span className="required">*</span></label>
                        <input id="name" type="text"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            onBlur={() => validateField('name', formData.name)}
                            placeholder="Enter full name" maxLength={100}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="email" className="field-label">Email <span className="required">*</span></label>
                        <input id="email" type="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => validateField('email', formData.email)}
                            placeholder="email@company.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="team" className="field-label">Team <span className="required">*</span></label>
                        <input id="team" type="text"
                            className={`form-input ${errors.team ? 'error' : ''}`}
                            value={formData.team}
                            onChange={(e) => handleChange('team', e.target.value)}
                            onBlur={() => validateField('team', formData.team)}
                            placeholder="Enter team name" list="teams-list" maxLength={50}
                        />
                        <datalist id="teams-list">
                            {COMMON_TEAMS.map(t => <option key={t} value={t} />)}
                        </datalist>
                        {errors.team && <span className="error-message">{errors.team}</span>}
                    </div>
                </section>

                {/* Role & Level */}
                <section className="form-section">
                    <label className="section-label">📊 Role & Level</label>

                    <div className="form-field">
                        <label htmlFor="track" className="field-label">Track <span className="required">*</span></label>
                        <select id="track"
                            className={`form-select ${errors.track ? 'error' : ''}`}
                            value={formData.track}
                            onChange={(e) => handleChange('track', e.target.value)}
                            onBlur={() => validateField('track', formData.track)}
                        >
                            <option value="">Select track</option>
                            <option value="IC">IC (Individual Contributor)</option>
                            <option value="LEADERSHIP">Leadership (Management)</option>
                            <option value="PRODUCT">Product</option>
                        </select>
                        {errors.track && <span className="error-message">{errors.track}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="currentLevel" className="field-label">Current Level <span className="required">*</span></label>
                        <select id="currentLevel"
                            className={`form-select ${errors.currentLevel ? 'error' : ''}`}
                            value={formData.currentLevel}
                            onChange={(e) => handleChange('currentLevel', e.target.value)}
                            onBlur={() => validateField('currentLevel', formData.currentLevel)}
                        >
                            <option value="">Select level</option>
                            <option value="L1">L1</option>
                            <option value="L2">L2</option>
                            <option value="L3">L3</option>
                            <option value="L4">L4</option>
                            <option value="L5">L5</option>
                            <option value="L6">L6</option>
                        </select>
                        {errors.currentLevel && <span className="error-message">{errors.currentLevel}</span>}
                    </div>
                </section>

                {/* Reporting Structure */}
                <section className="form-section">
                    <label className="section-label">👔 Reporting Structure</label>

                    <div className="form-field">
                        <label htmlFor="managerId" className="field-label">
                            Manager <span className="optional">(Optional)</span>
                        </label>
                        <select id="managerId" className="form-select"
                            value={formData.managerId}
                            onChange={(e) => handleChange('managerId', e.target.value)}
                        >
                            <option value="">No manager assigned</option>
                            {managers.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name} ({m.currentLevel} · {m.team})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="joinDate" className="field-label">
                            Join Date <span className="optional">(Optional)</span>
                        </label>
                        <input id="joinDate" type="date" className="form-input"
                            value={formData.joinDate}
                            onChange={(e) => handleChange('joinDate', e.target.value)}
                        />
                    </div>
                </section>

                {/* Capability Ratings */}
                <section className="form-section">
                    <label className="section-label">
                        📊 Initial Capability Ratings
                        <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--md-sys-color-on-surface-variant)', marginLeft: '12px' }}>
                            ({ratedCount} of {CAPABILITIES.length} rated) <span className="optional">(Optional)</span>
                        </span>
                    </label>
                    <p style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '20px', fontStyle: 'italic' }}>
                        Set initial capability scores. You can skip this and add ratings later via the Evaluation form.
                    </p>
                    <div className="sliders-grid">
                        {CAPABILITIES.map(cap => (
                            <CapabilitySlider
                                key={cap.code}
                                capabilityName={cap.name}
                                value={formData.capabilities[cap.code]}
                                onChange={(val) => handleCapabilityChange(cap.code, val)}
                            />
                        ))}
                    </div>
                </section>

                {/* Notes */}
                <section className="form-section">
                    <label className="section-label">📝 Notes <span className="optional">(Optional)</span></label>
                    <textarea className="notes-textarea"
                        placeholder="Add context about this employee's background, capabilities, or any relevant notes..."
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={4}
                    />
                </section>

                {/* Error Message */}
                {submitError && (
                    <section className="form-section form-section--error">
                        <div className="form-message form-message--error">
                            <span>❌</span><span>{submitError}</span>
                        </div>
                    </section>
                )}

                {/* Success Message */}
                {submitSuccess && (
                    <section className="form-section form-section--success">
                        <div className="form-message form-message--success">
                            <span>{submitSuccess}</span>
                        </div>
                    </section>
                )}

                {/* Actions */}
                <section className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={!isFormValid || isSubmitting}>
                        {isSubmitting ? '⏳ Creating...' : '✅ Create Employee'}
                    </button>
                </section>
            </form>
        </div>
    );
};

export default AddEmployee;
