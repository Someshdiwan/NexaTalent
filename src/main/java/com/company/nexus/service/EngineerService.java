package com.company.nexus.service;

import com.company.nexus.dto.CreateEngineerRequest;
import com.company.nexus.dto.EngineerResponse;
import com.company.nexus.entity.Engineer;
import com.company.nexus.exception.ResourceNotFoundException;
import com.company.nexus.repository.EngineerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EngineerService {

    private final EngineerRepository engineerRepository;

    @Transactional
    public EngineerResponse createEngineer(CreateEngineerRequest request) {
        if (engineerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Engineer with email " + request.getEmail() + " already exists");
        }

        Engineer engineer = request.toEntity();
        Engineer savedEngineer = engineerRepository.save(engineer);
        return EngineerResponse.fromEntity(savedEngineer);
    }

    public EngineerResponse getEngineerById(String id) {
        Engineer engineer = findEngineerById(Long.parseLong(id));
        return EngineerResponse.fromEntity(engineer);
    }

    public List<EngineerResponse> getAllEngineers() {
        return engineerRepository.findAll().stream()
                .map(EngineerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<EngineerResponse> getEngineersByTeam(String team) {
        return engineerRepository.findByTeam(team).stream()
                .map(EngineerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<EngineerResponse> getEngineersByTrack(String track) {
        Engineer.Track trackEnum = Engineer.Track.valueOf(track.toUpperCase());
        return engineerRepository.findByTrack(trackEnum).stream()
                .map(EngineerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public EngineerResponse updateEngineer(String id, CreateEngineerRequest request) {
        Engineer engineer = findEngineerById(Long.parseLong(id));

        engineer.setName(request.getName());
        engineer.setEmail(request.getEmail());
        engineer.setCurrentLevel(request.getCurrentLevel());
        engineer.setTrack(request.getTrack());
        engineer.setTeam(request.getTeam());
        engineer.setManagerId(request.getManagerId());
        engineer.setAvatarUrl(request.getAvatarUrl());

        Engineer updatedEngineer = engineerRepository.save(engineer);
        return EngineerResponse.fromEntity(updatedEngineer);
    }

    @Transactional
    public void deleteEngineer(String id) {
        Engineer engineer = findEngineerById(Long.parseLong(id));
        engineerRepository.delete(engineer);
    }

    public Engineer findEngineerById(Long id) {
        return engineerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Engineer not found with id: " + id));
    }

    public Engineer getEngineerByEmail(String email) {
        return engineerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Engineer not found with email: " + email));
    }
}