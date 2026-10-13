import { useState } from 'react';
import { login, register } from '../../api/nexusApi';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

interface LoginProps {
    onLogin: (token: string, user: { email: string; firstName: string; lastName: string; role: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<'ADMIN' | 'EMPLOYER' | 'CANDIDATE'>('EMPLOYER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMessage('');
        // Clear registration fields when switching to login
        if (!isLogin) {
            setFirstName('');
            setLastName('');
            setRole('EMPLOYER');
        }
    };

    const validateForm = () => {
        if (!email.trim()) return 'Email is required';
        if (!email.includes('@')) return 'Please enter a valid email address';
        if (!password.trim()) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';

        if (!isLogin) {
            if (!firstName.trim()) return 'First name is required';
            if (!lastName.trim()) return 'Last name is required';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isLogin) {
                const response = await login({ email, password });
                if (response.success && response.data) {
                    setSuccessMessage('Login successful!');
                    const user = {
                        email: response.data.email,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        role: response.data.role
                    };
                    setTimeout(() => onLogin(response.data.token, user), 500);
                } else {
                    setError(response.error?.message || 'Login failed. Please check your credentials.');
                }
            } else {
                const response = await register({
                    email,
                    password,
                    firstName,
                    lastName,
                    role
                });
                if (response.success) {
                    setSuccessMessage('Registration successful! Redirecting to login...');
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessMessage('');
                        // Clear registration fields
                        setFirstName('');
                        setLastName('');
                        setRole('EMPLOYER');
                    }, 1500);
                } else {
                    setError(response.error?.message || 'Registration failed. Please try again.');
                }
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isLogin ? 'Login to Nexus' : 'Register for Nexus'}</h2>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="your.email@company.com"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="Doe"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'ADMIN' | 'EMPLOYER' | 'CANDIDATE')}
                                >
                                    <option value="EMPLOYER">Employer - Can manage jobs and evaluations</option>
                                    <option value="ADMIN">Admin - Full system access</option>
                                    <option value="CANDIDATE">Candidate - Limited access</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="toggle-mode">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="link-button"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>

                {!isLogin && (
                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Email: admin@nexus.com</p>
                        <p>Password: password123</p>
                        <p>Role: ADMIN</p>
                    </div>
                )}
            </div>
        </div>
    );
}