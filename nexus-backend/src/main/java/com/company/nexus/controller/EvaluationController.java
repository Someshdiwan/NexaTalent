package com.company.nexus.controller;

import com.company.nexus.dto.CapabilitySnapshotResponse;
import com.company.nexus.dto.SubmitEvaluationRequest;
import com.company.nexus.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class EvaluationController {
    private final EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<CapabilitySnapshotResponse> submitEvaluation(@Valid @RequestBody
                                                                           SubmitEvaluationRequest request) {
        CapabilitySnapshotResponse response = evaluationService.submitEvaluation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CapabilitySnapshotResponse> getEvaluation(@PathVariable String id) {
        CapabilitySnapshotResponse response = evaluationService.getEvaluationById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/engineer/{engineerId}/evaluations")
    public ResponseEntity<List<CapabilitySnapshotResponse>> getEngineerEvaluations(@PathVariable String engineerId) {
        List<CapabilitySnapshotResponse> response = evaluationService.getEngineerEvaluations(engineerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/engineer/{engineerId}/latest")
    public ResponseEntity<CapabilitySnapshotResponse> getLatestEvaluation(@PathVariable String engineerId) {
        Optional<CapabilitySnapshotResponse> response = evaluationService.getLatestEvaluation(engineerId);
        return response.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/engineer/{engineerId}/history")
    public ResponseEntity<List<CapabilitySnapshotResponse>> getEvaluationHistory(@PathVariable String engineerId) {
        List<CapabilitySnapshotResponse> response = evaluationService.getEvaluationHistory(engineerId);
        return ResponseEntity.ok(response);
    }
}
