// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { getNextLevel, getTargetProfile } from '../../mocks/mockData';
import type { CapabilityCode, CapabilitySnapshot, Engineer } from '../../types/domain';
import { CAPABILITIES } from '../../config/capabilities';
import { calculateReadinessScore, getStatusColor, getStatusText } from '../../utils/readinessCalculator';
import { CapabilitySlider } from '../../components/forms/CapabilitySlider';
import { CapabilityRadar } from '../../components/charts/CapabilityRadar';
import { getEngineers, submitEvaluation, setAuthToken } from '../../api/nexusApi';
import { useAuth } from '../../contexts/AuthContext';
import "./Evaluation.css";

interface EvaluationProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    preselectedEngineerId?: string;
}

export const Evaluation: React.FC<EvaluationProps> = ({ onSuccess, onCancel, preselectedEngineerId }) => {
    const { token, user } = useAuth();

    // Engineers loaded from backend
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [loadingEngineers, setLoadingEngineers] = useState(true);

    const [selectedEngineerId, setSelectedEngineerId] = useState<string>(preselectedEngineerId || '');
    const [ratings, setRatings] = useState<Record<CapabilityCode, number>>({
        SYSTEM_DESIGN: 0,
        TECHNICAL_DEPTH: 0,
        CODE_OWNERSHIP: 0,
        DEBUGGING: 0,
        COMMUNICATION: 0,
        PRODUCT_THINKING: 0,
        EXECUTION: 0,
        MENTORSHIP: 0,
        ARCHITECTURE_VISION: 0
    });
    const [notes, setNotes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Fetch engineers from backend
    useEffect(() => {
        if (!token) return;
        setAuthToken(token);
        const fetchEngineers = async () => {
            setLoadingEngineers(true);
            try {
                const response = await getEngineers();
                if (response.success && response.data) {
                    setEngineers(response.data);
                    // Set default selected engineer
                    if (!selectedEngineerId && response.data.length > 0) {
                        const match = preselectedEngineerId
                            ? response.data.find(e => String(e.id) === String(preselectedEngineerId))
                            : null;
                        setSelectedEngineerId(String(match?.id || response.data[0].id));
                    }
                }
            } catch (err) {
                console.error('Failed to load engineers', err);
            } finally {
                setLoadingEngineers(false);
            }
        };
        fetchEngineers();
    }, [token]);

    const selectedEngineer = useMemo(
        () => engineers.find(e => String(e.id) === String(selectedEngineerId)),
        [engineers, selectedEngineerId]
    );

    const targetLevel = useMemo(
        () => selectedEngineer ? getNextLevel(selectedEngineer.currentLevel) : 'L1',
        [selectedEngineer]
    );

    const targetProfile = useMemo(
        () => getTargetProfile(targetLevel),
        [targetLevel]
    );

    // Live readiness calculation
    const readiness = useMemo(() => {
        if (!selectedEngineer) return null;
        const mockSnapshot: CapabilitySnapshot = {
            id: 'PREVIEW',
            engineerId: String(selectedEngineer.id),
            evaluatorId: 'CURRENT_USER',
            evaluatedAt: new Date().toISOString(),
            capabilities: ratings
        };
        return calculateReadinessScore(mockSnapshot, targetProfile);
    }, [selectedEngineer, ratings, targetProfile]);

    // Radar preview data
    const radarData = useMemo(() => {
        return CAPABILITIES.map(cap => ({
            capability: cap.name,
            current: ratings[cap.code],
            target: targetProfile.requirements[cap.code] || 0,
            fullMark: 4
        }));
    }, [ratings, targetProfile]);

    const handleRatingChange = (capabilityCode: CapabilityCode, value: number) => {
        setRatings(prev => ({ ...prev, [capabilityCode]: value }));
    };

    const isFormValid = useMemo(() => {
        const hasRatings = Object.values(ratings).some(rating => rating > 0);
        const allValid = Object.values(ratings).every(rating => rating >= 0 && rating <= 4);
        return hasRatings && allValid && selectedEngineer != null;
    }, [ratings, selectedEngineer]);

    const ratedCount = useMemo(() => {
        return Object.values(ratings).filter(rating => rating > 0).length;
    }, [ratings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !selectedEngineer) {
            setSubmitError('Please rate at least one capability');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        // Build payload matching SubmitEvaluationRequest DTO
        const payload = {
            engineerId: Number(selectedEngineer.id),
            evaluatorId: user?.email || 'admin@nexus.com',
            capabilities: ratings,      // Map<String, Integer> — keys are e.g. "SYSTEM_DESIGN"
            notes: notes || undefined
        };

        console.log('📸 Submitting evaluation:', JSON.stringify(payload, null, 2));

        try {
            const response = await submitEvaluation(payload as any);
            if (response.success) {
                setRatings({
                    SYSTEM_DESIGN: 0, TECHNICAL_DEPTH: 0, CODE_OWNERSHIP: 0,
                    DEBUGGING: 0, COMMUNICATION: 0, PRODUCT_THINKING: 0,
                    EXECUTION: 0, MENTORSHIP: 0, ARCHITECTURE_VISION: 0
                });
                setNotes('');
                setIsSubmitting(false);
                onSuccess?.();
            } else {
                setSubmitError(response.error?.message || 'Failed to submit evaluation. Please try again.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            setSubmitError('Network error. Please check your connection and try again.');
            setIsSubmitting(false);
        }
    };

    if (loadingEngineers) {
        return (
            <div className="evaluation-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <p>Loading engineers...</p>
                </div>
            </div>
        );
    }

    if (engineers.length === 0) {
        return (
            <div className="evaluation-page">
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <p>No engineers found. Please add engineers first.</p>
                    <button className="btn-cancel" onClick={onCancel}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="evaluation-page">
            <div className="evaluation-header">
                <h1>📝 New Capability Evaluation</h1>
                <p className="evaluation-subtitle">Submit structured capability assessment</p>
            </div>

            <form className="evaluation-form" onSubmit={handleSubmit}>
                {/* Engineer Selection */}
                <section className="form-section">
                    <label className="section-label">👤 Engineer</label>
                    <select
                        className="engineer-select"
                        value={selectedEngineerId}
                        onChange={(e) => setSelectedEngineerId(e.target.value)}
                    >
                        {engineers.map(engineer => (
                            <option key={engineer.id} value={String(engineer.id)}>
                                {engineer.name} ({engineer.currentLevel} • {engineer.track} • {engineer.team})
                            </option>
                        ))}
                    </select>
                    {selectedEngineer && (
                        <div className="level-context">
                            Current: <strong>{selectedEngineer.currentLevel}</strong> → Target: <strong>{targetLevel}</strong>
                        </div>
                    )}
                </section>

                {/* Capability Ratings */}
                <section className="form-section">
                    <label className="section-label">
                        📊 Capability Ratings
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 'normal',
                            color: '#94a3b8',
                            marginLeft: '12px'
                        }}>
                            ({ratedCount} of {CAPABILITIES.length} rated)
                        </span>
                    </label>
                    <div className="sliders-grid">
                        {CAPABILITIES.map(capability => (
                            <CapabilitySlider
                                key={capability.code}
                                capabilityName={capability.name}
                                value={ratings[capability.code]}
                                onChange={(value) => handleRatingChange(capability.code, value)}
                            />
                        ))}
                    </div>
                    {ratedCount === 0 && (
                        <div style={{
                            marginTop: '16px', padding: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px', color: '#fca5a5', fontSize: '14px'
                        }}>
                            ⚠️ Please rate at least one capability to submit the evaluation
                        </div>
                    )}
                </section>

                {/* Live Preview */}
                {readiness && (
                    <section className="form-section preview-section">
                        <label className="section-label">📈 Live Preview</label>
                        <div className="readiness-preview">
                            <div className="preview-score">
                                <span className="preview-label">Readiness Score:</span>
                                <span className="preview-value" style={{ color: getStatusColor(readiness.status) }}>
                                    {readiness.score}%
                                </span>
                            </div>
                            <div className="preview-status" style={{ color: getStatusColor(readiness.status), borderColor: getStatusColor(readiness.status) }}>
                                {getStatusText(readiness.status)}
                            </div>
                        </div>
                        <div className="radar-preview">
                            <CapabilityRadar data={radarData} showTarget={true} colors={{ current: '#06b6d4', target: '#f59e0b' }} />
                        </div>
                        {readiness.gaps.length > 0 && (
                            <div className="gaps-preview">
                                <strong>Capability Gaps:</strong>
                                <ul>
                                    {readiness.gaps.slice(0, 3).map(gap => (
                                        <li key={gap.capability}>
                                            {gap.capabilityName}: +{gap.gap} level{gap.gap > 1 ? 's' : ''} needed
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}

                {/* Notes */}
                <section className="form-section">
                    <label className="section-label">📝 Evaluation Notes</label>
                    <textarea
                        className="notes-textarea"
                        placeholder="Add context, achievements, areas for improvement..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                    />
                </section>

                {/* Error Message */}
                {submitError && (
                    <section className="form-section" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>❌</span><span>{submitError}</span>
                        </div>
                    </section>
                )}

                {/* Actions */}
                <section className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={!isFormValid || isSubmitting}>
                        {isSubmitting ? '⏳ Submitting...' : '✅ Submit Evaluation'}
                    </button>
                </section>
            </form>
        </div>
    );
};

export default Evaluation;
