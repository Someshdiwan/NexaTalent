import type {Capability, CapabilityCode} from '../types/domain.ts';

/**
 * All capability definitions
 * Used by Evaluation form and other components
 */
export const CAPABILITIES: Capability[] = [
    {
        code: "SYSTEM_DESIGN",
        name: "System Design",
        description: "Ability to design scalable, maintainable systems",
        maxLevel: 4
    },
    {
        code: "TECHNICAL_DEPTH",
        name: "Technical Depth",
        description: "Deep understanding of technologies and algorithms",
        maxLevel: 4
    },
    {
        code: "CODE_OWNERSHIP",
        name: "Code Ownership",
        description: "Taking ownership of code quality and systems",
        maxLevel: 4
    },
    {
        code: "DEBUGGING",
        name: "Debugging & Reliability",
        description: "Identifying and resolving issues effectively",
        maxLevel: 4
    },
    {
        code: "COMMUNICATION",
        name: "Communication & Influence",
        description: "Effective communication and influencing decisions",
        maxLevel: 4
    },
    {
        code: "PRODUCT_THINKING",
        name: "Product Thinking",
        description: "Understanding user needs and product strategy",
        maxLevel: 4
    },
    {
        code: "EXECUTION",
        name: "Execution & Delivery",
        description: "Consistently delivering quality work on time",
        maxLevel: 4
    },
    {
        code: "MENTORSHIP",
        name: "Mentorship",
        description: "Guiding and developing other engineers",
        maxLevel: 4
    },
    {
        code: "ARCHITECTURE_VISION",
        name: "Architecture Vision",
        description: "Defining long-term technical direction",
        maxLevel: 4
    }
];

/**
 * Get capability by code
 */
export function getCapabilityByCode(code: CapabilityCode): Capability | undefined {
    return CAPABILITIES.find(cap => cap.code === code);
}

/**
 * Get all capability codes
 */
export function getAllCapabilityCodes(): CapabilityCode[] {
    return CAPABILITIES.map(cap => cap.code);
}

/*
import type { CapabilityCode } from '../types/domain';

export const CAPABILITY_NAMES: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN: 'System Design',
    TECHNICAL_DEPTH: 'Technical Depth',
    CODE_OWNERSHIP: 'Code Ownership',
    DEBUGGING: 'Debugging & Reliability',
    COMMUNICATION: 'Communication & Influence',
    PRODUCT_THINKING: 'Product Thinking',
    EXECUTION: 'Execution & Delivery',
    MENTORSHIP: 'Mentorship',
    ARCHITECTURE_VISION: 'Architecture Vision',
};

export const CAPABILITY_DESCRIPTIONS: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN: 'Design scalable, maintainable systems',
    TECHNICAL_DEPTH: 'Depth in core technologies and fundamentals',
    CODE_OWNERSHIP: 'Ownership of quality, tests, and systems',
    DEBUGGING: 'Diagnose and resolve complex issues',
    COMMUNICATION: 'Communicate ideas and influence decisions',
    PRODUCT_THINKING: 'Understand users and business impact',
    EXECUTION: 'Deliver results reliably',
    MENTORSHIP: 'Grow other engineers',
    ARCHITECTURE_VISION: 'Long-term technical direction',
};*/
