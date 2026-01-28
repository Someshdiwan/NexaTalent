package com.company.nexus.controller;

import com.company.nexus.dto.AuthRequest;
import com.company.nexus.dto.JwtResponse;
import com.company.nexus.dto.UserRegistrationRequest;
import com.company.nexus.dto.UserResponse;
import com.company.nexus.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest registrationRequest) {
        UserResponse response = authService.registerUser(registrationRequest);
        return ResponseEntity.ok(response);
    }
}
