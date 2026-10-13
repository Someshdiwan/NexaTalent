# API Contracts (FROZEN)

## Engineers

### Create Engineer
POST /api/engineers
Request: CreateEngineerRequest
Response: CreateEngineerResponse

### Get Engineer
GET /api/engineers/{id}
Response: Engineer

### List Engineers
GET /api/engineers?team={team}&track={track}
Response: Engineer[]

## Evaluations

### Submit Evaluation
POST /api/evaluations
Request: SubmitEvaluationRequest
Response: SubmitEvaluationResponse

### Get Latest Snapshot
GET /api/evaluations/engineer/{id}/latest
Response: CapabilitySnapshot

### Get History
GET /api/evaluations/engineer/{id}/history
Response: CapabilitySnapshot[]

### Get Readiness
GET /api/evaluations/engineer/{id}/readiness?targetLevel={level}
Response: ReadinessAnalysis
```

---

### 3. Create JSON Examples (Backend Reference)

File: `contracts/examples/` (NEW FOLDER)

Save actual JSON that frontend will send/receive.

```
Phase 1: Frontend Design        ✅ COMPLETE
Phase 2: Core Features          ✅ COMPLETE
Phase 3: Forms & Validation     ✅ COMPLETE
Phase 4: Contract Freeze        ⏳ IN PROGRESS (next step)
Phase 5: Backend Implementation ⏸️ WAITING