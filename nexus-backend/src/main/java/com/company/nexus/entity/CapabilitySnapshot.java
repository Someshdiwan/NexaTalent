package com.company.nexus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "capability_snapshots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapabilitySnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engineer_id", nullable = false)
    private Engineer engineer;

    @Column(nullable = false)
    private String evaluatorId;

    @Column(nullable = false)
    private LocalDateTime evaluatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Engineer.Level levelContext;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Engineer.Track trackContext;

    @ElementCollection
    @CollectionTable(
        name = "capability_scores",
        joinColumns = @JoinColumn(name = "snapshot_id")
    )
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "capability")
    @Column(name = "score")
    private Map<Capability, Integer> capabilities;

    @Column(length = 1000)
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum Capability {
        SYSTEM_DESIGN,
        TECHNICAL_DEPTH,
        CODE_OWNERSHIP,
        DEBUGGING,
        COMMUNICATION,
        PRODUCT_THINKING,
        EXECUTION,
        MENTORSHIP,
        ARCHITECTURE_VISION
    }
}
