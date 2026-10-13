// FROZEN CONTRACTS - Backend must match exactly

import type {CapabilityCode, CapabilitySnapshot, Engineer, Level, Track} from "./domain.ts";

export interface CreateEngineerRequest {
    name: string;
    email: string;
    track: Track;
    currentLevel: Level;
    team: string;
    managerId?: string;
    joinDate?: string;
}

export interface CreateEngineerResponse {
    success: boolean;
    data: Engineer;
    timestamp: string;
}

export interface SubmitEvaluationRequest {
    engineerId: string;
    evaluatorId: string;
    capabilities: Record<CapabilityCode, number>;
    evaluatorNotes?: string;
}

export interface SubmitEvaluationResponse {
    success: boolean;
    data: CapabilitySnapshot;
    timestamp: string;
}