package com.company.nexus.dto;

import com.company.nexus.entity.CapabilitySnapshot;
import com.company.nexus.entity.Engineer;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitEvaluationRequest {
    @NotNull(message = "Engineer ID is required")
    @Positive(message = "Engineer ID must be positive")
    private Long engineerId;

    @NotBlank(message = "Evaluator ID is required")
    private String evaluatorId;

    @NotNull(message = "Capabilities are required")
    @Size(min = 9, max = 9, message = "All 9 capabilities must be provided")
    private Map<String, Integer> capabilities;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    public CapabilitySnapshot toEntity(Engineer engineer) {
        // Convert String keys to Capability enum and validate scores
        Map<CapabilitySnapshot.Capability, Integer> capabilityMap = new java.util.HashMap<>();

        for (Map.Entry<String, Integer> entry : capabilities.entrySet()) {
            Integer score = entry.getValue();

            // Validate score range
            if (score == null || score < 0 || score > 4) {
                throw new IllegalArgumentException(
                    "Capability score for " + entry.getKey() + " must be between 0 and 4"
                );
            }

            // Convert String to Capability enum
            try {
                CapabilitySnapshot.Capability capability = CapabilitySnapshot.Capability.valueOf
                        (entry.getKey().toUpperCase());
                capabilityMap.put(capability, score);
            }
            catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                    "Invalid capability name: " + entry.getKey() + ". Must be one of: " +
                    java.util.Arrays.toString(CapabilitySnapshot.Capability.values())
                );
            }
        }

        return CapabilitySnapshot.builder()
                .engineer(engineer)
                .evaluatorId(evaluatorId)
                .evaluatedAt(LocalDateTime.now())
                .levelContext(engineer.getCurrentLevel())
                .trackContext(engineer.getTrack())
                .capabilities(capabilityMap)
                .notes(notes)
                .build();
    }
}
