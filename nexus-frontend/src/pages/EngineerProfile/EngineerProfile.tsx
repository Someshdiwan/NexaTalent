// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';
import {
    getTargetProfile,
    getNextLevel,
} from '../../mocks/mockData';
import { CapabilityRadar } from '../../components/charts/CapabilityRadar';
import {
    calculateReadinessScore,
    calculateGrowth,
    getStatusColor,
    getStatusText
} from '../../utils/readinessCalculator';
import { type CapabilityCode, CAPABILITY_NAMES, type Engineer } from '../../types/domain.ts';
import { getEngineerEvaluations, setAuthToken } from '../../api/nexusApi';
import { useAuth } from '../../contexts/AuthContext';
import './EngineerProfile.css';

interface EngineerProfileProps {
    engineer: Engineer;
    onNewEvaluation?: () => void;
}

export const EngineerProfile: React.FC<EngineerProfileProps> = ({ engineer, onNewEvaluation }) => {
    const { token } = useAuth();
    const [snapshots, setSnapshots] = useState<any[]>([]);
    const [loadingSnapshots, setLoadingSnapshots] = useState(true);

    useEffect(() => {
        if (!token || !engineer?.id) return;
        setAuthToken(token);
        const fetchSnapshots = async () => {
            setLoadingSnapshots(true);
            try {
                const response = await getEngineerEvaluations(String(engineer.id));
                if (response.success && response.data) {
                    // Sort by evaluatedAt desc — latest first
                    const sorted = [...response.data].sort(
                        (a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime()
                    );
                    setSnapshots(sorted);
                }
            } catch (err) {
                console.error('Failed to load snapshots', err);
            } finally {
                setLoadingSnapshots(false);
            }
        };
        fetchSnapshots();
    }, [token, engineer?.id]);

    // Convert backend snapshot to frontend format
    const convertSnapshot = (snap: any) => {
        if (!snap) return null;
        // Backend returns capabilities as object {SYSTEM_DESIGN: 3, ...}
        const caps: Record<CapabilityCode, number> = snap.capabilities || {};
        return {
            id: String(snap.id),
            engineerId: String(snap.engineerId || engineer.id),
            evaluatorId: snap.evaluatorId,
            evaluatedAt: snap.evaluatedAt,
            capabilities: caps,
            notes: snap.notes
        };
    };

    const latestSnapshot = useMemo(() => convertSnapshot(snapshots[0]), [snapshots]);
    const previousSnapshot = useMemo(() => convertSnapshot(snapshots[1]), [snapshots]);

    const targetLevel = getNextLevel(engineer.currentLevel);
    const targetProfile = getTargetProfile(targetLevel);

    const readiness = useMemo(() => {
        if (!latestSnapshot) return null;
        return calculateReadinessScore(latestSnapshot, targetProfile);
    }, [latestSnapshot, targetProfile]);

    const growth = useMemo(() => {
        if (!latestSnapshot || !previousSnapshot) return null;
        return calculateGrowth(latestSnapshot, previousSnapshot);
    }, [latestSnapshot, previousSnapshot]);

    const currentVsTargetData = useMemo(() => {
        if (!latestSnapshot) return [];
        return Object.entries(latestSnapshot.capabilities).map(([cap, current]) => ({
            capability: CAPABILITY_NAMES[cap as CapabilityCode] || cap,
            current: current as number,
            target: targetProfile.requirements[cap as CapabilityCode] || 3,
            fullMark: 4
        }));
    }, [latestSnapshot, targetProfile]);

    const growthRadarData = useMemo(() => {
        if (!latestSnapshot || !previousSnapshot) return [];
        return Object.entries(latestSnapshot.capabilities).map(([cap, current]) => ({
            capability: CAPABILITY_NAMES[cap as CapabilityCode] || cap,
            current: current as number,
            previous: (previousSnapshot.capabilities[cap as CapabilityCode] as number) || 0,
            fullMark: 4
        }));
    }, [latestSnapshot, previousSnapshot]);

    if (loadingSnapshots) {
        return (
            <div className="engineer-profile">
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <p>Loading evaluation data...</p>
                </div>
            </div>
        );
    }

    if (!latestSnapshot || !readiness) {
        return (
            <div className="engineer-profile">
                {/* Identity Card always shown */}
                <section className="identity-card">
                    <div className="profile-avatar-large">
                        {engineer.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="profile-info">
                        <h1>{engineer.name}</h1>
                        <p className="profile-email">{engineer.email}</p>
                        <div className="profile-badges">
                            <span className="badge level-badge">{engineer.currentLevel}</span>
                            <span className="badge track-badge">{engineer.track}</span>
                            <span className="badge team-badge">{engineer.team}</span>
                        </div>
                    </div>
                </section>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <p>📋 No evaluation data available yet for this engineer.</p>
                    <button className="btn-primary" onClick={onNewEvaluation} style={{ marginTop: '1rem' }}>
                        📝 Submit First Evaluation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="engineer-profile">
            {/* Identity Card */}
            <section className="identity-card">
                <div className="profile-avatar-large">
                    {engineer.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="profile-info">
                    <h1>{engineer.name}</h1>
                    <p className="profile-email">{engineer.email}</p>
                    <div className="profile-badges">
                        <span className="badge level-badge">{engineer.currentLevel}</span>
                        <span className="badge track-badge">{engineer.track}</span>
                        <span className="badge team-badge">{engineer.team}</span>
                    </div>
                </div>
            </section>

            {/* Readiness Signal */}
            <section className="readiness-signal">
                <div className="readiness-card">
                    <div className="readiness-header">
                        <div>
                            <h2>Promotion Readiness</h2>
                            <p className="readiness-target">{engineer.currentLevel} → {targetLevel}</p>
                        </div>
                        <div className="readiness-score" style={{ color: getStatusColor(readiness.status) }}>
                            {readiness.score}%
                        </div>
                    </div>
                    <div className="readiness-bar-container">
                        <div
                            className="readiness-bar-fill"
                            style={{
                                width: `${readiness.score}%`,
                                background: `linear-gradient(90deg, ${getStatusColor(readiness.status)}, #667eea)`
                            }}
                        />
                    </div>
                    <div className="readiness-status" style={{ color: getStatusColor(readiness.status) }}>
                        {getStatusText(readiness.status)}
                    </div>
                </div>
            </section>

            {/* Radar #1: Current vs Target */}
            <section className="radar-section">
                <h2>Capability Profile: Current vs Target ({targetLevel})</h2>
                <CapabilityRadar
                    data={currentVsTargetData}
                    showTarget={true}
                    colors={{ current: '#06b6d4', target: '#f59e0b' }}
                />
            </section>

            {/* Gap Summary */}
            <section className="gap-summary">
                <h2>Capability Gaps</h2>
                {readiness.gaps.length > 0 ? (
                    <div className="gap-grid">
                        {readiness.gaps.map((gap) => (
                            <div key={gap.capability} className="gap-card">
                                <div className="gap-header">
                                    <span className="gap-capability">{gap.capabilityName}</span>
                                    <span className="gap-delta">+{gap.gap}</span>
                                </div>
                                <div className="gap-levels">
                                    <span className="level-current">Current: {gap.current}</span>
                                    <span className="level-required">Required: {gap.required}</span>
                                </div>
                                <div className="gap-bar">
                                    <div className="gap-bar-current" style={{ width: `${(gap.current / 4) * 100}%` }} />
                                    <div className="gap-bar-target" style={{ left: `${(gap.current / 4) * 100}%`, width: `${(gap.gap / 4) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-gaps">✅ All capabilities meet target requirements</div>
                )}
            </section>

            {/* Radar #2: Growth Over Time */}
            {previousSnapshot && growth && (
                <section className="radar-section">
                    <h2>Growth Over Time</h2>
                    <div className="growth-summary">
                        <div className="growth-stat">
                            <span className="growth-label">Overall Growth:</span>
                            <span className={`growth-value ${growth.overallGrowth > 0 ? 'positive' : 'neutral'}`}>
                                {growth.overallGrowth > 0 ? '+' : ''}{growth.overallGrowth.toFixed(2)}
                            </span>
                        </div>
                        <div className="growth-indicators">
                            <span className="growth-indicator improving">↗ {growth.improving.length} Improving</span>
                            <span className="growth-indicator stable">→ {growth.stable.length} Stable</span>
                            {growth.declining.length > 0 && (
                                <span className="growth-indicator declining">↘ {growth.declining.length} Declining</span>
                            )}
                        </div>
                    </div>
                    <CapabilityRadar
                        data={growthRadarData.map(d => ({ ...d, target: d.previous, current: d.current }))}
                        showTarget={true}
                        colors={{ current: '#10b981', target: '#64748b' }}
                    />
                </section>
            )}

            {/* Recommendations */}
            <section className="recommendations">
                <h2>Recommendations</h2>
                <div className="recommendation-list">
                    {readiness.recommendations.map((rec, idx) => (
                        <div key={idx} className="recommendation-item">
                            <span className="recommendation-icon">
                                {readiness.status === 'PROMOTION_READY' ? '✅' : '💡'}
                            </span>
                            <span className="recommendation-text">{rec}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Actions */}
            <section className="actions">
                <button className="btn-primary" onClick={onNewEvaluation}>📝 New Evaluation</button>
                <button className="btn-secondary">📊 Export Report</button>
                <button className="btn-secondary">📅 View History</button>
            </section>
        </div>
    );
};

export default EngineerProfile;
