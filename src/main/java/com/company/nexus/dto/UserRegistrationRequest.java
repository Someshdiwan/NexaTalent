package com.company.nexus.dto;

import com.company.nexus.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Role is required")
    private User.Role role;

    private String bio;
    private String phone;
    private String location;
    private String company;
    private String position;
    private Integer experienceYears;

    public User toEntity() {
        return User.builder()
                .email(email)
                .password(password) // Will be encoded by service
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .bio(bio)
                .phone(phone)
                .location(location)
                .company(company)
                .position(position)
                .experienceYears(experienceYears)
                .build();
    }
}
