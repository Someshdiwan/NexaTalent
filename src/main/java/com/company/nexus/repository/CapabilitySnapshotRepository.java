package com.company.nexus.repository;

import java.util.Optional;

import com.company.nexus.entity.CapabilitySnapshot;
import com.company.nexus.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapabilitySnapshotRepository extends JpaRepository<CapabilitySnapshot, Long> {
    List<CapabilitySnapshot> findByEngineerIdOrderByEvaluatedAtDesc(Long engineerId);





    List<CapabilitySnapshot> findByEngineerIdAndEngineerCurrentLevelOrderByEvaluatedAtDesc(Long engineerId,
                                                                                           Engineer.Level level);






    Optional<CapabilitySnapshot> findTopByEngineerIdOrderByEvaluatedAtDesc(Long engineerId);






    List<CapabilitySnapshot> findByEvaluatorIdOrderByEvaluatedAtDesc(String evaluatorId);
}
