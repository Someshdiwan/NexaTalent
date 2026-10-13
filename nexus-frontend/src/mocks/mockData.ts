import type{
    Engineer,
    CapabilitySnapshot,
    TargetProfile,
    Capability,
    Level,
    CapabilityCode,
} from '../types/domain.ts';

// CAPABILITY DEFINITIONS
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


// MOCK ENGINEERS
export const MOCK_ENGINEERS: Engineer[] = [
    {
        id: "E-1001",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        track: "IC",
        currentLevel: "L3",
        team: "Platform Engineering",
        managerId: "E-9001",
        status: "ACTIVE",
        createdAt: "2024-01-15T08:00:00Z"
    },
    {
        id: "E-1002",
        name: "Marcus Rodriguez",
        email: "marcus.r@company.com",
        track: "IC",
        currentLevel: "L2",
        team: "Platform Engineering",
        managerId: "E-9001",
        status: "ACTIVE",
        createdAt: "2024-03-20T08:00:00Z"
    },
    {
        id: "E-1003",
        name: "Priya Sharma",
        email: "priya.s@company.com",
        track: "LEADERSHIP",
        currentLevel: "L4",
        team: "Infrastructure",
        managerId: "E-9002",
        status: "ACTIVE",
        createdAt: "2023-06-10T08:00:00Z"
    },
    {
        id: "E-1004",
        name: "Alex Kim",
        email: "alex.kim@company.com",
        track: "IC",
        currentLevel: "L4",
        team: "AI/ML",
        managerId: "E-9003",
        status: "ACTIVE",
        createdAt: "2022-11-05T08:00:00Z"
    }
];

// MOCK SNAPSHOTS (WITH HISTORY)
export const MOCK_SNAPSHOTS: Record<string, CapabilitySnapshot[]> = {
    "E-1001": [
        // Latest snapshot (Jan 2026)
        {
            snapshotId: "SNAP-2001-LATEST",
            engineerId: "E-1001",
            evaluatorId: "E-9001",
            evaluatedAt: "2026-01-10T14:30:00Z",
            trackContext: "IC",
            levelContext: "L3",
            capabilities: {
                SYSTEM_DESIGN: 3,
                TECHNICAL_DEPTH: 3,
                CODE_OWNERSHIP: 4,
                DEBUGGING: 3,
                COMMUNICATION: 3,
                PRODUCT_THINKING: 2,
                EXECUTION: 4,
                MENTORSHIP: 2,
                ARCHITECTURE_VISION: 2
            },
            evaluatorNotes: "Strong technical execution. Ready for L4 with more mentorship focus.",
            createdAt: "2026-01-10T14:30:00Z"
        },
        // Previous snapshot (Jul 2025) - 6 months ago
        {
            snapshotId: "SNAP-2001-PREV",
            engineerId: "E-1001",
            evaluatorId: "E-9001",
            evaluatedAt: "2025-07-15T10:00:00Z",
            trackContext: "IC",
            levelContext: "L3",
            capabilities: {
                SYSTEM_DESIGN: 2,
                TECHNICAL_DEPTH: 3,
                CODE_OWNERSHIP: 3,
                DEBUGGING: 3,
                COMMUNICATION: 2,
                PRODUCT_THINKING: 2,
                EXECUTION: 3,
                MENTORSHIP: 1,
                ARCHITECTURE_VISION: 2
            },
            evaluatorNotes: "Solid progress. Continue focus on system design.",
            createdAt: "2025-07-15T10:00:00Z"
        }
    ],
    "E-1002": [
        {
            snapshotId: "SNAP-2002-LATEST",
            engineerId: "E-1002",
            evaluatorId: "E-9001",
            evaluatedAt: "2026-01-12T10:00:00Z",
            trackContext: "IC",
            levelContext: "L2",
            capabilities: {
                SYSTEM_DESIGN: 2,
                TECHNICAL_DEPTH: 2,
                CODE_OWNERSHIP: 3,
                DEBUGGING: 2,
                COMMUNICATION: 2,
                PRODUCT_THINKING: 1,
                EXECUTION: 3,
                MENTORSHIP: 1,
                ARCHITECTURE_VISION: 1
            },
            evaluatorNotes: "Solid progress. Focus on system design for L3 readiness.",
            createdAt: "2026-01-12T10:00:00Z"
        }
    ]
};

// TARGET PROFILES (Level Requirements)
export const TARGET_PROFILES: Record<Level, TargetProfile> = {
    L1: {
        level: "L1",
        track: "IC",
        requirements: {
            SYSTEM_DESIGN: 1,
            TECHNICAL_DEPTH: 1,
            CODE_OWNERSHIP: 1,
            DEBUGGING: 1,
            COMMUNICATION: 1,
            PRODUCT_THINKING: 0,
            EXECUTION: 1,
            MENTORSHIP: 0,
            ARCHITECTURE_VISION: 0
        }
    },
    L2: {
        level: "L2",
        track: "IC",
        requirements: {
            SYSTEM_DESIGN: 2,
            TECHNICAL_DEPTH: 2,
            CODE_OWNERSHIP: 2,
            DEBUGGING: 2,
            COMMUNICATION: 2,
            PRODUCT_THINKING: 1,
            EXECUTION: 2,
            MENTORSHIP: 1,
            ARCHITECTURE_VISION: 1
        }
    },
    L3: {
        level: "L3",
        track: "IC",
        requirements: {
            SYSTEM_DESIGN: 3,
            TECHNICAL_DEPTH: 3,
            CODE_OWNERSHIP: 3,
            DEBUGGING: 3,
            COMMUNICATION: 2,
            PRODUCT_THINKING: 2,
            EXECUTION: 3,
            MENTORSHIP: 2,
            ARCHITECTURE_VISION: 2
        }
    },
    L4: {
        level: "L4",
        track: "IC",
        requirements: {
            SYSTEM_DESIGN: 4,
            TECHNICAL_DEPTH: 4,
            CODE_OWNERSHIP: 4,
            DEBUGGING: 4,
            COMMUNICATION: 3,
            PRODUCT_THINKING: 3,
            EXECUTION: 4,
            MENTORSHIP: 3,
            ARCHITECTURE_VISION: 3
        }
    },
    L5: {
        level: "L5",
        track: "IC",
        requirements: {
            SYSTEM_DESIGN: 4,
            TECHNICAL_DEPTH: 4,
            CODE_OWNERSHIP: 4,
            DEBUGGING: 4,
            COMMUNICATION: 4,
            PRODUCT_THINKING: 4,
            EXECUTION: 4,
            MENTORSHIP: 4,
            ARCHITECTURE_VISION: 4
        }
    }
};


// HELPER FUNCTIONS
export function getEngineerById(id: string): Engineer | undefined {
    return MOCK_ENGINEERS.find(e => e.id === id);
}

export function getLatestSnapshot(engineerId: string): CapabilitySnapshot | undefined {
    const snapshots = MOCK_SNAPSHOTS[engineerId];
    return snapshots ? snapshots[0] : undefined;
}

export function getPreviousSnapshot(engineerId: string): CapabilitySnapshot | undefined {
    const snapshots = MOCK_SNAPSHOTS[engineerId];
    return snapshots && snapshots.length > 1 ? snapshots[1] : undefined;
}

export function getAllSnapshots(engineerId: string): CapabilitySnapshot[] {
    return MOCK_SNAPSHOTS[engineerId] || [];
}

export function getTargetProfile(level: Level): TargetProfile {
    return TARGET_PROFILES[level];
}

export function getNextLevel(current: Level): Level {
    const levels: Level[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
    const index = levels.indexOf(current);
    return index < levels.length - 1 ? levels[index + 1] : current;
}

export function getAllActiveEngineers(): Engineer[] {
    return MOCK_ENGINEERS.filter(e => e.status === "ACTIVE");
}