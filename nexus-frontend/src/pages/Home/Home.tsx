// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import './Home.css';

interface HomeProps {
    onGetStarted?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge animate-fade-in">
                        <span>Welcome to</span>
                    </div>
                    <h1 className="hero-title animate-fade-in" style={{ animationDelay: '100ms' }}>
                        NEXUS
                    </h1>
                    <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '200ms' }}>
                        The Complete Engineering Talent Management Platform
                    </p>
                    <p className="hero-description animate-fade-in" style={{ animationDelay: '300ms' }}>
                        Track performance, growth, and promotion readiness across your engineering organization. Make data-driven decisions with comprehensive capability assessments and real-time insights.
                    </p>
                    <div className="hero-actions animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <button className="btn-primary-large" onClick={onGetStarted}>
                            Get Started →
                        </button>
                        <button className="btn-secondary-large">
                            Learn More
                        </button>
                    </div>
                </div>
                <div className="hero-visual animate-scale-in" style={{ animationDelay: '500ms' }}>
                    <div className="visual-card">
                        <div className="visual-icon">✨</div>
                        <div className="visual-text">NEXUS</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Key Features</h2>
                <div className="features-grid">
                    <div className="feature-card animate-stagger">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Capability Assessment</h3>
                        <p className="feature-description">
                            Comprehensive evaluation of 9 core engineering capabilities with real-time readiness scoring.
                        </p>
                    </div>
                    <div className="feature-card animate-stagger">
                        <div className="feature-icon">📈</div>
                        <h3 className="feature-title">Growth Tracking</h3>
                        <p className="feature-description">
                            Monitor engineer development over time with historical snapshots and trend analysis.
                        </p>
                    </div>
                    <div className="feature-card animate-stagger">
                        <div className="feature-icon">🎯</div>
                        <h3 className="feature-title">Promotion Readiness</h3>
                        <p className="feature-description">
                            Data-driven insights into promotion readiness with gap analysis and recommendations.
                        </p>
                    </div>
                    <div className="feature-card animate-stagger">
                        <div className="feature-icon">👥</div>
                        <h3 className="feature-title">Team Overview</h3>
                        <p className="feature-description">
                            Organization-wide dashboard with team statistics and engineer roster management.
                        </p>
                    </div>
                    <div className="feature-card animate-stagger">
                        <div className="feature-icon">📝</div>
                        <h3 className="feature-title">Structured Evaluations</h3>
                        <p className="feature-description">
                            Create detailed capability evaluations with live preview and instant feedback.
                        </p>
                    </div>
                    <div className="feature-card animate-stagger">
                        <div className="feature-icon">🔍</div>
                        <h3 className="feature-title">Advanced Analytics</h3>
                        <p className="feature-description">
                            Visual radar charts, gap analysis, and actionable recommendations for growth.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step-card animate-stagger">
                        <div className="step-number">1</div>
                        <h3 className="step-title">Add Engineers</h3>
                        <p className="step-description">
                            Onboard your engineering team members with their roles, levels, and team assignments.
                        </p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step-card animate-stagger">
                        <div className="step-number">2</div>
                        <h3 className="step-title">Conduct Evaluations</h3>
                        <p className="step-description">
                            Create capability assessments using our structured evaluation form with live preview.
                        </p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step-card animate-stagger">
                        <div className="step-number">3</div>
                        <h3 className="step-title">Track Growth</h3>
                        <p className="step-description">
                            Monitor progress over time, identify gaps, and get recommendations for development.
                        </p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step-card animate-stagger">
                        <div className="step-number">4</div>
                        <h3 className="step-title">Make Decisions</h3>
                        <p className="step-description">
                            Use data-driven insights for promotions, assignments, and team planning.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Transform Your Engineering Team?</h2>
                    <p className="cta-description">
                        Start tracking capabilities, growth, and readiness today.
                    </p>
                    <button className="btn-primary-large" onClick={onGetStarted}>
                        Get Started Now →
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
