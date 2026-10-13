// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from 'react';
import { Home } from './pages/Home/Home';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { EngineerProfile } from './pages/EngineerProfile/EngineerProfile';
import { Evaluation } from './pages/Evaluation/Evaluation';
import { AddEmployee } from './pages/AddEmployee/AddEmployee';
import { Login } from './pages/Login/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Engineer } from './types/domain.ts';
import './theme.css';

type View = 'login' | 'home' | 'dashboard' | 'profile' | 'evaluation' | 'add-employee';

// SVG Icons
const SunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const SearchIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

function AppContent() {
    const { isAuthenticated, login, logout, isLoading } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [currentView, setCurrentView] = useState<View>('login');
    const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Initialize theme & Scroll listener
    useEffect(() => {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem('nexus-theme') as 'light' | 'dark' | null;

        if (savedTheme) {
            setTheme(savedTheme);
            root.classList.toggle('dark', savedTheme === 'dark');
        } else {
            root.classList.add('dark');
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Redirect based on auth status
    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                if (currentView === 'login') {
                    setCurrentView('dashboard');
                }
            } else {
                if (currentView !== 'home' && currentView !== 'login') {
                    setCurrentView('login');
                }
            }
        }
    }, [isAuthenticated, isLoading, currentView]);

    // Handle successful login
    const handleLogin = (token: string, user: any) => {
        login(token, user);
        setCurrentView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        setCurrentView('login');
        setSelectedEngineer(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const toggleTheme = () => {
        const root = document.documentElement;
        const newTheme = theme === 'light' ? 'dark' : 'light';
        root.classList.toggle('dark', newTheme === 'dark');
        setTheme(newTheme);
        localStorage.setItem('nexus-theme', newTheme);
    };

    // TODO: Implement engineer search from backend API
    const filteredEngineers: Engineer[] = [];

    const handleNewEvaluation = (engineerId?: string) => {
        // TODO: Fetch engineer from backend API if needed
        setCurrentView('evaluation');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="app">
            {/* Header - Only show when authenticated */}
            {isAuthenticated && (
                <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
                    <div className="header-content">
                        <div className="logo" onClick={() => setCurrentView('dashboard')}>
                            <span>NEXUS</span>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="nav-tabs">
                            <button
                                className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setCurrentView('dashboard')}
                            >
                                📊 Dashboard
                            </button>
                            <button
                                className={`nav-tab ${currentView === 'profile' ? 'active' : ''}`}
                                onClick={() => setCurrentView('profile')}
                            >
                                👤 Profile
                            </button>
                            <button
                                className={`nav-tab ${currentView === 'evaluation' ? 'active' : ''}`}
                                onClick={() => setCurrentView('evaluation')}
                            >
                                📝 New Evaluation
                            </button>
                            <button
                                className={`nav-tab ${currentView === 'add-employee' ? 'active' : ''}`}
                                onClick={() => setCurrentView('add-employee')}
                            >
                                ➕ New Employee
                            </button>
                        </nav>

                    <div className="header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {isAuthenticated && (
                            <button
                                className="icon-btn"
                                onClick={() => setShowSearch(!showSearch)}
                                aria-label="Search"
                                style={{ color: showSearch ? 'var(--md-sys-color-primary)' : 'inherit' }}
                            >
                                {showSearch ? <CloseIcon /> : <SearchIcon />}
                            </button>
                        )}

                        {isAuthenticated && (
                            <button
                                className="icon-btn logout-btn"
                                onClick={handleLogout}
                                aria-label="Logout"
                                title="Logout"
                            >
                                🚪
                            </button>
                        )}

                        <button
                            className="icon-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </div>
            </header>
            )}

            {/* Floating Search Overlay - Only show when authenticated */}
            {isAuthenticated && showSearch && (
                <div className="search-container">
                    <div className="search-bar animate-scale-in">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Find engineers, teams, or emails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            autoFocus
                        />
                    </div>

                    {searchQuery && (
                        <div className="search-results">
                            {filteredEngineers.length > 0 ? (
                                filteredEngineers.map(eng => (
                                    <button
                                        key={eng.id}
                                        className="search-result-item"
                                        onClick={() => {
                                            setSelectedEngineer(eng);
                                            setCurrentView('profile');
                                            setSearchQuery('');
                                            setShowSearch(false);
                                        }}
                                    >
                                        <div className="result-avatar">
                                            {eng.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="result-info">
                                            <div className="result-name">{eng.name}</div>
                                            <div className="result-meta">
                                                {eng.currentLevel} • {eng.team}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="search-empty" style={{ padding: '24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    No engineers found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main className="app-main">
                <div key={currentView} className="view-transition">
                    {currentView === 'login' && (
                        <Login onLogin={handleLogin} />
                    )}

                    {currentView === 'dashboard' && isAuthenticated && (
                        <Dashboard
                            onSelectEngineer={(eng) => {
                                setSelectedEngineer(eng);
                                setCurrentView('profile');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}

                    {currentView === 'profile' && isAuthenticated && (
                        <EngineerProfile
                            engineer={selectedEngineer}
                            onNewEvaluation={handleNewEvaluation}
                        />
                    )}

                    {currentView === 'evaluation' && isAuthenticated && (
                        <Evaluation
                            key={selectedEngineer?.id || "eval"}
                            preselectedEngineerId={selectedEngineer?.id}
                            onSuccess={() => {
                                // After successful submission, go back to dashboard
                                setCurrentView('dashboard');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onCancel={() => {
                                setCurrentView('dashboard');
                            }}
                        />
                    )}

                    {currentView === 'add-employee' && isAuthenticated && (
                        <AddEmployee
                            onSuccess={(newEngineer) => {
                                // After successful creation, go to the new employee's profile
                                setSelectedEngineer(newEngineer);
                                setCurrentView('profile');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onCancel={() => {
                                setCurrentView('dashboard');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
