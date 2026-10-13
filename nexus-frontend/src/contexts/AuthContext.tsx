import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setAuthToken, clearAuthToken, getAuthToken } from '../api/nexusApi';

interface User {
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const storedToken = getAuthToken();
        const storedUser = localStorage.getItem('nexus-user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                setAuthToken(storedToken); // Set token for API calls
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                // Clear invalid data
                clearAuthToken();
                localStorage.removeItem('nexus-user');
            }
        }

        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        setAuthToken(newToken); // Set token for API calls
        localStorage.setItem('nexus-user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        clearAuthToken(); // Clear token from API client
        localStorage.removeItem('nexus-user');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
