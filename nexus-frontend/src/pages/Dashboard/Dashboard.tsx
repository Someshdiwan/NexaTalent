import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getEngineers, setAuthToken } from '../../api/nexusApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Engineer } from '../../types/domain.ts';

interface DashboardProps {
    onSelectEngineer?: (engineer: Engineer) => void;
}

// Readiness progress bar component
const ReadinessIndicator = ({ score }: { score: number }) => {
    const getColor = (s: number) => {
        if (s >= 80) return '#10b981'; // Green
        if (s >= 60) return '#f59e0b'; // Orange/Amber
        return '#64748b'; // Gray
    };

    return (
        <div className="readiness-indicator">
            <div className="readiness-bar-bg">
                <div
                    className="readiness-bar-fill"
                    style={{
                        width: `${score}%`,
                        backgroundColor: getColor(score)
                    }}
                />
            </div>
            <span className="readiness-score">{score}%</span>
        </div>
    );
};

// Status dot component
const StatusDot = ({ isReady }: { isReady: boolean }) => (
    <span className={`status-dot ${isReady ? 'ready' : 'not-ready'}`}>
        <span className="dot-inner" />
    </span>
);

export const Dashboard: React.FC<DashboardProps> = ({ onSelectEngineer }) => {
    const { token } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sync token into API client then fetch engineers
    useEffect(() => {
        if (!token) return; // Wait until we have a token

        // Ensure the API module has the token (in case of page refresh)
        setAuthToken(token);

        const fetchEngineers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getEngineers();
                if (response.success && response.data) {
                    setEngineers(response.data);
                } else {
                    setError(response.error?.message || 'Failed to fetch engineers');
                }
            } catch (err) {
                setError('Network error. Please check your connection.');
            } finally {
                setLoading(false);
                setIsVisible(true);
            }
        };

        fetchEngineers();
    }, [token]);

    // Give each engineer a stable readiness score based on their id
    const engineersWithReadiness = engineers.map(eng => {
        const seed = parseInt(String(eng.id), 10) || 1;
        const readiness = ((seed * 37) % 61) + 30; // Stable value 30-90 based on id
        return { ...eng, promotionReadiness: readiness };
    });

    // Filter engineers based on search
    const filteredEngineers = engineersWithReadiness.filter(eng =>
        eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eng.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eng.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const totalEngineers = engineersWithReadiness.length;
    const avgReadiness = totalEngineers > 0
        ? Math.round(engineersWithReadiness.reduce((acc, curr) => acc + curr.promotionReadiness, 0) / totalEngineers)
        : 0;
    const promoReadyCount = engineersWithReadiness.filter(e => e.promotionReadiness >= 80).length;

    // Loading state
    if (loading) {
        return (
            <div className="dashboard-container">
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <div className="loading-spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--border-color)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p>Loading engineers...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="dashboard-container">
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <p style={{ color: 'red', marginBottom: '1rem', fontSize: '1.1rem' }}>⚠️ {error}</p>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Make sure the backend is running at http://localhost:8080</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`dashboard-container fade-in ${isVisible ? 'visible' : ''}`}>
            {/* Header Section */}
            <header className="dashboard-header animate-slide-in" style={{ animationDelay: '0ms' }}>
                <div className="header-content">
                    <h1 className="dashboard-title">Team Overview</h1>
                    <p className="dashboard-subtitle">
                        Track performance, growth, and promotion readiness across your engineering org.
                    </p>
                </div>
            </header>

            {/* Key Metrics Cards */}
            <section className="stats-grid">
                <div className="stat-card animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <div className="stat-icon-wrapper blue">
                        <span>👥</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{totalEngineers}</div>
                        <div className="stat-label">Total Engineers</div>
                    </div>
                    <div className="stat-trend neutral">Stable</div>
                </div>

                <div className="stat-card animate-scale-in" style={{ animationDelay: '150ms' }}>
                    <div className="stat-icon-wrapper green">
                        <span>✅</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{promoReadyCount}</div>
                        <div className="stat-label">Ready for Promo</div>
                    </div>
                    <div className="stat-trend positive">+2 this quarter</div>
                </div>

                <div className="stat-card animate-scale-in" style={{ animationDelay: '200ms' }}>
                    <div className="stat-icon-wrapper purple">
                        <span>📈</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{avgReadiness}%</div>
                        <div className="stat-label">Avg. Readiness</div>
                    </div>
                    <div className="stat-trend positive">↑ 4% vs last month</div>
                </div>
            </section>

            {/* Engineer Roster */}
            <section className="roster-section animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="section-header">
                    <h2 className="section-title">Engineering Roster</h2>
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name, team, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <div className="roster-card">
                    <table className="roster-table">
                        <thead>
                        <tr>
                            <th className="roster-header">Engineer</th>
                            <th className="roster-header">Team</th>
                            <th className="roster-header">Current Level</th>
                            <th className="roster-header">Promo Readiness</th>
                            <th className="roster-header">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEngineers.map((eng, index) => (
                            <tr
                                key={eng.id}
                                className="roster-row"
                                onClick={() => onSelectEngineer?.(eng)}
                                style={{ animationDelay: `${index * 50}ms`, cursor: 'pointer' }}
                            >
                                <td className="roster-cell">
                                    <div className="cell-primary">
                                        <div className="engineer-avatar">
                                            {eng.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div className="engineer-details">
                                            <div className="engineer-name">{eng.name}</div>
                                            <div className="engineer-email">{eng.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="roster-cell team-cell">
                                    <span className="team-tag">{eng.team}</span>
                                </td>
                                <td className="roster-cell">
                                    <span className="badge badge-level">{eng.currentLevel}</span>
                                </td>
                                <td className="roster-cell">
                                    <ReadinessIndicator score={eng.promotionReadiness} />
                                </td>
                                <td className="roster-cell">
                                    <StatusDot isReady={eng.promotionReadiness >= 80} />
                                </td>
                            </tr>
                        ))}
                        {filteredEngineers.length === 0 && !searchQuery && (
                            <tr>
                                <td colSpan={5} className="no-results">
                                    <div className="no-results-content">
                                        <span className="no-results-icon">👥</span>
                                        <p>No engineers found. Add your first engineer!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {filteredEngineers.length === 0 && searchQuery && (
                            <tr>
                                <td colSpan={5} className="no-results">
                                    <div className="no-results-content">
                                        <span className="no-results-icon">🔍</span>
                                        <p>No engineers found matching "{searchQuery}"</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
