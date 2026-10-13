// ============================================
// NEXUS DOMAIN TYPES
// Frozen Contract - Backend must match these exactly
// ============================================

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type Level = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export type Track = "IC" | "LEADERSHIP" | "PRODUCT";

export type CapabilityCode =
    | 'SYSTEM_DESIGN'
    | 'TECHNICAL_DEPTH'
    | 'CODE_OWNERSHIP'
    | 'DEBUGGING'
    | 'COMMUNICATION'
    | 'PRODUCT_THINKING'
    | 'EXECUTION'
    | 'MENTORSHIP'
    | 'ARCHITECTURE_VISION';

// Human-readable names for capabilities
export const CAPABILITY_NAMES: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN: 'System Design',
    TECHNICAL_DEPTH: 'Technical Depth',
    CODE_OWNERSHIP: 'Code Ownership',
    DEBUGGING: 'Debugging',
    COMMUNICATION: 'Communication',
    PRODUCT_THINKING: 'Product Thinking',
    EXECUTION: 'Execution',
    MENTORSHIP: 'Mentorship',
    ARCHITECTURE_VISION: 'Architecture'
};

// Capability descriptions for tooltips/help text
export const CAPABILITY_DESCRIPTIONS: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN: 'Ability to design scalable, maintainable systems',
    TECHNICAL_DEPTH: 'Deep expertise in core technologies and fundamentals',
    CODE_OWNERSHIP: 'Quality, testing, documentation, and maintenance of code',
    DEBUGGING: 'Ability to diagnose and resolve complex issues',
    COMMUNICATION: 'Written and verbal communication effectiveness',
    PRODUCT_THINKING: 'Understanding user needs and business impact',
    EXECUTION: 'Delivering results reliably and efficiently',
    MENTORSHIP: 'Growing and supporting other engineers',
    ARCHITECTURE_VISION: 'Long-term technical strategy and direction'
};

// All capability codes as an array (useful for iteration)
export const ALL_CAPABILITIES: CapabilityCode[] = [
    'SYSTEM_DESIGN',
    'TECHNICAL_DEPTH',
    'CODE_OWNERSHIP',
    'DEBUGGING',
    'COMMUNICATION',
    'PRODUCT_THINKING',
    'EXECUTION',
    'MENTORSHIP',
    'ARCHITECTURE_VISION'
];

// ============================================
// CORE ENTITIES
// ============================================

/**
 * Engineer - Core identity entity
 */
export interface Engineer {
    id: string;
    name: string;
    email: string;
    currentLevel: Level;
    track: Track;
    team: string;
    managerId?: string;
    joinDate: string; // ISO date string
    avatarUrl?: string;
}

/**
 * CapabilitySnapshot - Immutable evaluation record
 * This is the core data structure for all evaluations
 */
export interface CapabilitySnapshot {
    id: string;
    engineerId: string;
    evaluatorId: string;
    evaluatedAt: string; // ISO datetime string
    capabilities: Record<CapabilityCode, number>; // 0-4 scale
    notes?: string;
}

/**
 * TargetProfile - Requirements for each level
 */
export interface TargetProfile {
    level: Level;
    requirements: Record<CapabilityCode, number>; // Required score (0-4)
}

// ============================================
// DERIVED TYPES (Computed from snapshots)
// ============================================

/**
 * RadarDataPoint - For chart rendering
 */
export interface RadarDataPoint {
    capability: string; // Human-readable name
    current: number;    // Current score
    target: number;     // Target score
    fullMark: number;   // Max possible (always 4)
}

/**
 * GrowthDataPoint - For comparing snapshots over time
 */
export interface GrowthDataPoint {
    capability: string;
    current: number;
    previous: number;
    growth: number;
}

/**
 * CapabilityGap - Single gap analysis item
 */
export interface CapabilityGap {
    capability: CapabilityCode;
    capabilityName: string;
    current: number;
    required: number;
    gap: number;
}

/**
 * ReadinessResult - Complete readiness analysis
 */
export interface ReadinessResult {
    score: number;
    status: 'PROMOTION_READY' | 'STRETCH_READY' | 'IN_DEVELOPMENT';
    gaps: CapabilityGap[];
    recommendations: string[];
    meetsMinimum: boolean;
}

/**
 * GrowthResult - Growth analysis between snapshots
 */
export interface GrowthResult {
    overallGrowth: number;
    improving: CapabilityCode[];
    declining: CapabilityCode[];
    stable: CapabilityCode[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================
// FORM TYPES
// ============================================

/**
 * Evaluation form data
 */
export interface EvaluationFormData {
    engineerId: string;
    capabilities: Partial<Record<CapabilityCode, number>>;
    notes: string;
}

/**
 * Evaluation submission payload
 */
export interface EvaluationSubmission {
    engineerId: string;
    evaluatorId: string;
    capabilities: Record<CapabilityCode, number>;
    notes?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Type guard for checking if a string is a valid CapabilityCode
 */
export function isCapabilityCode(value: string): value is CapabilityCode {
    return ALL_CAPABILITIES.includes(value as CapabilityCode);
}

/**
 * Type guard for checking if a string is a valid Level
 */
export function isLevel(value: string): value is Level {
    return ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].includes(value);
}

/**
 * Create an empty capabilities object with all zeros
 */
export function createEmptyCapabilities(): Record<CapabilityCode, number> {
    return {
        SYSTEM_DESIGN: 0,
        TECHNICAL_DEPTH: 0,
        CODE_OWNERSHIP: 0,
        DEBUGGING: 0,
        COMMUNICATION: 0,
        PRODUCT_THINKING: 0,
        EXECUTION: 0,
        MENTORSHIP: 0,
        ARCHITECTURE_VISION: 0
    };
}

/*
// ============================================
// NEXUS DOMAIN TYPES
// Frozen Contract - Backend must match these exactly
// ============================================

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type Level = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export type Track = 'IC' | 'Management';

export type CapabilityCode =
    | 'SYSTEM_DESIGN'
    | 'TECHNICAL_DEPTH'
    | 'CODE_OWNERSHIP'
    | 'DEBUGGING'
    | 'COMMUNICATION'
    | 'PRODUCT_THINKING'
    | 'EXECUTION'
    | 'MENTORSHIP'
    | 'ARCHITECTURE_VISION';

// Human-readable names for capabilities
export const CAPABILITY_NAMES: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN: 'System Design',
    TECHNICAL_DEPTH: 'Technical Depth',
    CODE_OWNERSHIP: 'Code Ownership',
    DEBUGGING: 'Debugging',
    COMMUNICATION: 'Communication',
    PRODUCT_THINKING: 'Product Thinking',
    EXECUTION: 'Execution',
    MENTORSHIP: 'Mentorship',
    ARCHITECTURE_VISION: 'Architecture'
};

// Capability descriptions for tooltips/help text
export const CAPABILITY_DESCRIPTIONS: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN: 'Ability to design scalable, maintainable systems',
    TECHNICAL_DEPTH: 'Deep expertise in core technologies and fundamentals',
    CODE_OWNERSHIP: 'Quality, testing, documentation, and maintenance of code',
    DEBUGGING: 'Ability to diagnose and resolve complex issues',
    COMMUNICATION: 'Written and verbal communication effectiveness',
    PRODUCT_THINKING: 'Understanding user needs and business impact',
    EXECUTION: 'Delivering results reliably and efficiently',
    MENTORSHIP: 'Growing and supporting other engineers',
    ARCHITECTURE_VISION: 'Long-term technical strategy and direction'
};

// All capability codes as an array (useful for iteration)
export const ALL_CAPABILITIES: CapabilityCode[] = [
    'SYSTEM_DESIGN',
    'TECHNICAL_DEPTH',
    'CODE_OWNERSHIP',
    'DEBUGGING',
    'COMMUNICATION',
    'PRODUCT_THINKING',
    'EXECUTION',
    'MENTORSHIP',
    'ARCHITECTURE_VISION'
];

// ============================================
// CORE ENTITIES
// ============================================

/**
 * Engineer - Core identity entity

export interface Engineer {
    id: string;
    name: string;
    email: string;
    currentLevel: Level;
    track: Track;
    team: string;
    managerId?: string;
    joinDate: string; // ISO date string
    avatarUrl?: string;
}

/**
 * CapabilitySnapshot - Immutable evaluation record
 * This is the core data structure for all evaluations

export interface CapabilitySnapshot {
    id: string;                    // ✅ Primary key
    engineerId: string;
    evaluatorId: string;
    evaluatedAt: string;           // ✅ ISO timestamp
    levelContext: Level;           // ✅ Explicit context
    trackContext: Track;           // ✅ Explicit context
    capabilities: Record<CapabilityCode, number>;
    notes?: string;                // ✅ Optional evaluator notes
}


/**
 * TargetProfile - Requirements for each level

export interface TargetProfile {
    level: Level;
    requirements: Record<CapabilityCode, number>; // Required score (0-4)
}

// ============================================
// DERIVED TYPES (Computed from snapshots)
// ============================================

/**
 * RadarDataPoint - For chart rendering

export interface RadarDataPoint {
    capability: string; // Human-readable name
    current: number;    // Current score
    target: number;     // Target score
    fullMark: number;   // Max possible (always 4)
}

/**
 * GrowthDataPoint - For comparing snapshots over time

export interface GrowthDataPoint {
    capability: string;
    current: number;
    previous: number;
    growth: number;
}

/**
 * CapabilityGap - Single gap analysis item

export interface CapabilityGap {
    capability: CapabilityCode;
    capabilityName: string;
    current: number;
    required: number;
    gap: number;
}

/**
 * ReadinessResult - Complete readiness analysis

export interface ReadinessResult {
    score: number;
    status: 'PROMOTION_READY' | 'STRETCH_READY' | 'IN_DEVELOPMENT';
    gaps: CapabilityGap[];
    recommendations: string[];
    meetsMinimum: boolean;
}

/**
 * GrowthResult - Growth analysis between snapshots

export interface GrowthResult {
    overallGrowth: number;
    improving: CapabilityCode[];
    declining: CapabilityCode[];
    stable: CapabilityCode[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * API Response wrapper

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: string;
}

/**
 * Paginated response

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================
// FORM TYPES
// ============================================

/**
 * Evaluation form data

export interface EvaluationFormData {
    engineerId: string;
    capabilities: Partial<Record<CapabilityCode, number>>;
    notes: string;
}

/**
 * Evaluation submission payload
 *
export interface EvaluationSubmission {
    engineerId: string;
    evaluatorId: string;
    capabilities: Record<CapabilityCode, number>;
    notes?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Type guard for checking if a string is a valid CapabilityCode

export function isCapabilityCode(value: string): value is CapabilityCode {
    return ALL_CAPABILITIES.includes(value as CapabilityCode);
}

/**
 * Type guard for checking if a string is a valid Level

export function isLevel(value: string): value is Level {
    return ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].includes(value);
}

/**
 * Create an empty capabilities object with all zeros

export function createEmptyCapabilities(): Record<CapabilityCode, number> {
    return {
        SYSTEM_DESIGN: 0,
        TECHNICAL_DEPTH: 0,
        CODE_OWNERSHIP: 0,
        DEBUGGING: 0,
        COMMUNICATION: 0,
        PRODUCT_THINKING: 0,
        EXECUTION: 0,
        MENTORSHIP: 0,
        ARCHITECTURE_VISION: 0
    };
}
*/
