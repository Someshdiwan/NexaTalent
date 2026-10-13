import type {CapabilitySnapshot, TargetProfile, CapabilityCode} from '../types/domain.ts';

// READINESS CALCULATION (FROZEN LOGIC)
export type ReadinessStatus = 'PROMOTION_READY' | 'STRETCH_READY' | 'IN_DEVELOPMENT';

export interface CapabilityGap {
    capability: CapabilityCode;
    capabilityName: string;
    current: number;
    required: number;
    gap: number;
}

export interface ReadinessResult {
    score: number; // 0-100
    status: ReadinessStatus;
    gaps: CapabilityGap[];
    recommendations: string[];
    meetsMinimum: boolean;
}

// Calculate promotion readiness score & FROZEN LOGIC - Backend must use same formula
export function calculateReadinessScore(
    snapshot: CapabilitySnapshot,
    targetProfile: TargetProfile
): ReadinessResult {
    const requirements = targetProfile.requirements;
    const current = snapshot.capabilities;

    let totalScore = 0;
    let maxScore = 0;
    const gaps: CapabilityGap[] = [];
    let hasBlockingGap = false;

    // Calculate score for each capability
    Object.entries(requirements).forEach(([cap, required]) => {
        const capCode = cap as CapabilityCode;
        const currentLevel = current[capCode] || 0;

        // Score calculation: current / required (capped at 1.0)
        const capScore = Math.min(currentLevel / required, 1.0);
        totalScore += capScore * required; // Weighted by requirement
        maxScore += required;

        // Track gaps
        if (currentLevel < required) {
            const gap = required - currentLevel;
            gaps.push({
                capability: capCode,
                capabilityName: getCapabilityName(capCode),
                current: currentLevel,
                required: required,
                gap: gap
            });

            // Blocking gap: more than 1 level behind
            if (gap > 1) {
                hasBlockingGap = true;
            }
        }
    });

    // Final readiness percentage
    const readinessPercent = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    // Determine status
    let status: ReadinessStatus;
    if (hasBlockingGap || readinessPercent < 60) {
        status = 'IN_DEVELOPMENT';
    } else if (readinessPercent >= 80 && gaps.length === 0) {
        status = 'PROMOTION_READY';
    } else if (readinessPercent >= 60) {
        status = 'STRETCH_READY';
    } else {
        status = 'IN_DEVELOPMENT';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(gaps, status);

    return {
        score: Math.round(readinessPercent),
        status,
        gaps: gaps.sort((a, b) => b.gap - a.gap), // Largest gaps first
        recommendations,
        meetsMinimum: !hasBlockingGap
    };
}

/**
 * Calculate growth between two snapshots
 */
export function calculateGrowth(
    latest: CapabilitySnapshot,
    previous: CapabilitySnapshot
): {
    overallGrowth: number;
    improving: CapabilityCode[];
    declining: CapabilityCode[];
    stable: CapabilityCode[];
} {
    const improving: CapabilityCode[] = [];
    const declining: CapabilityCode[] = [];
    const stable: CapabilityCode[] = [];

    let totalGrowth = 0;
    let capabilityCount = 0;

    Object.entries(latest.capabilities).forEach(([cap, currentLevel]) => {
        const capCode = cap as CapabilityCode;
        const previousLevel = previous.capabilities[capCode] || 0;
        const growth = currentLevel - previousLevel;

        totalGrowth += growth;
        capabilityCount++;

        if (growth > 0) {
            improving.push(capCode);
        } else if (growth < 0) {
            declining.push(capCode);
        } else {
            stable.push(capCode);
        }
    });

    const overallGrowth = capabilityCount > 0 ? totalGrowth / capabilityCount : 0;

    return {
        overallGrowth: Math.round(overallGrowth * 100) / 100,
        improving,
        declining,
        stable
    };
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(
    gaps: CapabilityGap[],
    status: ReadinessStatus
): string[] {
    const recommendations: string[] = [];

    if (status === 'PROMOTION_READY') {
        recommendations.push('Ready for promotion discussion with manager');
        recommendations.push('Prepare promotion packet highlighting recent achievements');
        return recommendations;
    }

    if (gaps.length === 0) {
        recommendations.push('All capabilities meet target requirements');
        recommendations.push('Focus on consistency and impact demonstration');
        return recommendations;
    }

    // Focus on top 3 gaps
    const topGaps = gaps.slice(0, 3);

    topGaps.forEach(gap => {
        if (gap.gap >= 2) {
            recommendations.push(
                `Critical: ${gap.capabilityName} needs +${gap.gap} levels - prioritize immediately`
            );
        } else if (gap.gap === 1) {
            recommendations.push(
                `Focus: ${gap.capabilityName} needs +1 level for target`
            );
        }
    });

    if (gaps.length > 3) {
        recommendations.push(`Additional ${gaps.length - 3} capabilities need attention`);
    }

    return recommendations;
}

/**
 * Get human-readable capability name
 */
function getCapabilityName(code: CapabilityCode): string {
    const names: Record<CapabilityCode, string> = {
        SYSTEM_DESIGN: "System Design",
        TECHNICAL_DEPTH: "Technical Depth",
        CODE_OWNERSHIP: "Code Ownership",
        DEBUGGING: "Debugging & Reliability",
        COMMUNICATION: "Communication & Influence",
        PRODUCT_THINKING: "Product Thinking",
        EXECUTION: "Execution & Delivery",
        MENTORSHIP: "Mentorship",
        ARCHITECTURE_VISION: "Architecture Vision"
    };
    return names[code] || code;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: ReadinessStatus): string {
    switch (status) {
        case 'PROMOTION_READY':
            return '#10b981'; // Green
        case 'STRETCH_READY':
            return '#f59e0b'; // Orange
        case 'IN_DEVELOPMENT':
            return '#64748b'; // Gray
    }
}

/**
 * Get status display text
 */
export function getStatusText(status: ReadinessStatus): string {
    switch (status) {
        case 'PROMOTION_READY':
            return '✅ Promotion Ready';
        case 'STRETCH_READY':
            return '🟠 Stretch Assignment Ready';
        case 'IN_DEVELOPMENT':
            return '⚪ In Development';
    }
}