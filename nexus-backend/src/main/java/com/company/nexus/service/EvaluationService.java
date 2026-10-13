package com.company.nexus.service;

import com.company.nexus.dto.CapabilitySnapshotResponse;
import com.company.nexus.dto.SubmitEvaluationRequest;
import com.company.nexus.entity.CapabilitySnapshot;
import com.company.nexus.entity.Engineer;
import com.company.nexus.exception.ResourceNotFoundException;
import com.company.nexus.repository.CapabilitySnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final CapabilitySnapshotRepository snapshotRepository;
    private final EngineerService engineerService;

    @Transactional
    public CapabilitySnapshotResponse submitEvaluation(SubmitEvaluationRequest request) {
        Engineer engineer = engineerService.findEngineerById(request.getEngineerId());

        CapabilitySnapshot snapshot = request.toEntity(engineer);
        CapabilitySnapshot savedSnapshot = snapshotRepository.save(snapshot);

        return CapabilitySnapshotResponse.fromEntity(savedSnapshot);
    }

    @Transactional(readOnly = true)
    public List<CapabilitySnapshotResponse> getEngineerEvaluations(String engineerId) {
        Long id = Long.parseLong(engineerId);
        return snapshotRepository.findByEngineerIdOrderByEvaluatedAtDesc(id).stream()
                .map(CapabilitySnapshotResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CapabilitySnapshotResponse getEvaluationById(String evaluationId) {
        CapabilitySnapshot snapshot = findSnapshotById(Long.parseLong(evaluationId));
        return CapabilitySnapshotResponse.fromEntity(snapshot);
    }

    @Transactional(readOnly = true)
    public Optional<CapabilitySnapshotResponse> getLatestEvaluation(String engineerId) {
        Long id = Long.parseLong(engineerId);
        return snapshotRepository.findTopByEngineerIdOrderByEvaluatedAtDesc(id)
                .map(CapabilitySnapshotResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<CapabilitySnapshotResponse> getEvaluationHistory(String engineerId) {
        return getEngineerEvaluations(engineerId);
    }

    public CapabilitySnapshot findSnapshotById(Long id) {
        return snapshotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));
    }
}
