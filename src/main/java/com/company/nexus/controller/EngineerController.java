package com.company.nexus.controller;

import com.company.nexus.dto.CreateEngineerRequest;
import com.company.nexus.dto.EngineerResponse;
import com.company.nexus.service.EngineerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/engineers")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class EngineerController {

    private final EngineerService engineerService;

    @PostMapping
    public ResponseEntity<EngineerResponse> createEngineer(@Valid @RequestBody CreateEngineerRequest request) {
        EngineerResponse response = engineerService.createEngineer(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EngineerResponse> getEngineer(@PathVariable String id) {
        EngineerResponse response = engineerService.getEngineerById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<EngineerResponse>> getEngineers(
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String track) {

        List<EngineerResponse> response;

        if (team != null && !team.trim().isEmpty()) {
            response = engineerService.getEngineersByTeam(team);
        } else if (track != null && !track.trim().isEmpty()) {
            response = engineerService.getEngineersByTrack(track);
        } else {
            response = engineerService.getAllEngineers();
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EngineerResponse> updateEngineer(
            @PathVariable String id,
            @Valid @RequestBody CreateEngineerRequest request) {
        EngineerResponse response = engineerService.updateEngineer(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEngineer(@PathVariable String id) {
        engineerService.deleteEngineer(id);
        return ResponseEntity.noContent().build();
    }
}