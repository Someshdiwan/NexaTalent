package com.company.nexus.dto;

import com.company.nexus.entity.CapabilitySnapshot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapabilitySnapshotResponse {

    private String id;
    private String engineerId;
    private String evaluatorId;
    private String evaluatedAt;
    private Map<String, Integer> capabilities;
    private String notes;

    public static CapabilitySnapshotResponse fromEntity(CapabilitySnapshot snapshot) {
        return CapabilitySnapshotResponse.builder()
                .id(snapshot.getId().toString())
                .engineerId(snapshot.getEngineer().getId().toString())
                .evaluatorId(snapshot.getEvaluatorId())
                .evaluatedAt(snapshot.getEvaluatedAt().toString())
                .capabilities(snapshot.getCapabilities().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> e.getKey().toString(),
                                Map.Entry::getValue
                        )))
                .notes(snapshot.getNotes())
                .build();
    }
}
