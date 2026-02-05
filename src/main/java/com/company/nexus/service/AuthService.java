package com.company.nexus.service;

import com.company.nexus.dto.AuthRequest;
import com.company.nexus.dto.JwtResponse;
import com.company.nexus.dto.UserRegistrationRequest;
import com.company.nexus.dto.UserResponse;
import com.company.nexus.entity.User;
import com.company.nexus.repository.UserRepository;
import com.company.nexus.security.JwtUtils;
import com.company.nexus.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public UserResponse registerUser(UserRegistrationRequest registrationRequest) {
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        // Create new user account
        User user = registrationRequest.toEntity();
        user.setPassword(encoder.encode(registrationRequest.getPassword()));

        User savedUser = userRepository.save(user);

        return UserResponse.fromEntity(savedUser);
    }

    public JwtResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
    }
}