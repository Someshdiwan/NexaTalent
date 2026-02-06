package com.company.nexus.repository;

import com.company.nexus.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EngineerRepository extends JpaRepository<Engineer, Long> {

    Optional<Engineer> findByEmail(String email);

    List<Engineer> findByTeam(String team);

    List<Engineer> findByTrack(Engineer.Track track);

    List<Engineer> findByCurrentLevel(Engineer.Level level);
}