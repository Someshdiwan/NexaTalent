import type { CapabilitySnapshot, Engineer, ApiResponse } from '../types/domain';

// API CONFIGURATION
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// AUTHENTICATION
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

export function clearAuthToken() {
    authToken = null;
    localStorage.removeItem('authToken');
}

export function getAuthToken(): string | null {
    if (!authToken) {
        authToken = localStorage.getItem('authToken');
    }
    return authToken;
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}

// API CLIENT
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                code: 'HTTP_ERROR',
                message: `HTTP ${response.status}: ${response.statusText}`,
            }));

            return {
                success: false,
                error: errorData.error || {
                    code: 'HTTP_ERROR',
                    message: `HTTP ${response.status}: ${response.statusText}`,
                },
                timestamp: new Date().toISOString(),
            };
        }

        const data = await response.json();

        return {
            success: true,
            data,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network request failed',
            },
            timestamp: new Date().toISOString(),
        };
    }
}

// EVALUATION API

//  Submit a new capability evaluation (snapshot)
export async function submitEvaluation(
    snapshot: CapabilitySnapshot
): Promise<ApiResponse<CapabilitySnapshot>> {
    return apiRequest<CapabilitySnapshot>('/evaluations', {
        method: 'POST',
        body: JSON.stringify(snapshot),
    });
}

// Get all evaluations for an engineer
export async function getEngineerEvaluations(
    engineerId: string
): Promise<ApiResponse<CapabilitySnapshot[]>> {
    return apiRequest<CapabilitySnapshot[]>(`/evaluations/engineer/${engineerId}/evaluations`);
}

// Get a specific evaluation by ID
export async function getEvaluation(
    evaluationId: string
): Promise<ApiResponse<CapabilitySnapshot>> {
    return apiRequest<CapabilitySnapshot>(`/evaluations/${evaluationId}`);
}


// ENGINEER API and Get all engineers
export async function getEngineers(): Promise<ApiResponse<Engineer[]>> {
    return apiRequest<Engineer[]>('/engineers');
}

// Get engineer by ID
export async function getEngineer(engineerId: string): Promise<ApiResponse<Engineer>> {
    return apiRequest<Engineer>(`/engineers/${engineerId}`);
}

// Create new engineer
export async function createEngineer(engineer: Partial<Engineer>): Promise<ApiResponse<Engineer>> {
    return apiRequest<Engineer>('/engineers', {
        method: 'POST',
        body: JSON.stringify(engineer),
    });
}

// Update engineer
export async function updateEngineer(engineerId: string, engineer: Partial<Engineer>): Promise<ApiResponse<Engineer>> {
    return apiRequest<Engineer>(`/engineers/${engineerId}`, {
        method: 'PUT',
        body: JSON.stringify(engineer),
    });
}

// Delete engineer
export async function deleteEngineer(engineerId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/engineers/${engineerId}`, {
        method: 'DELETE',
    });
}


// AUTHENTICATION API
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
}

export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface UserResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    bio?: string;
    phone?: string;
    location?: string;
    company?: string;
    position?: string;
    experienceYears?: number;
    createdAt: string;
    updatedAt: string;
}

// Login user and get JWT token
export async function login(request: LoginRequest): Promise<ApiResponse<JwtResponse>> {
    const response = await apiRequest<JwtResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(request),
    });

    // Store token if login successful
    if (response.success && response.data) {
        setAuthToken(response.data.token);
    }

    return response;
}

// Register new user
export async function register(request: RegisterRequest): Promise<ApiResponse<UserResponse>> {
    return apiRequest<UserResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

// Logout user (clear token)
export function logout() {
    setAuthToken(null);
}

// EXPORTS
export default {
    // Auth functions
    login,
    register,
    logout,
    setAuthToken,
    clearAuthToken,
    getAuthToken,
    isAuthenticated,

    // Engineer functions
    submitEvaluation,
    getEngineerEvaluations,
    getEvaluation,
    getEngineers,
    getEngineer,
    createEngineer,
    updateEngineer,
    deleteEngineer,
};
