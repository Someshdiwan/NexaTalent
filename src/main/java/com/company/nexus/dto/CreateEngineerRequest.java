package com.company.nexus.dto;

import com.company.nexus.entity.Engineer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEngineerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Current level is required")
    private Engineer.Level currentLevel;

    @NotNull(message = "Track is required")
    private Engineer.Track track;

    @NotBlank(message = "Team is required")
    private String team;

    private String managerId;

    private String avatarUrl;

    public Engineer toEntity() {
        return Engineer.builder()
                .name(name)
                .email(email)
                .currentLevel(currentLevel)
                .track(track)
                .team(team)
                .managerId(managerId)
                .joinDate(LocalDateTime.now())
                .avatarUrl(avatarUrl)
                .build();
    }
}
