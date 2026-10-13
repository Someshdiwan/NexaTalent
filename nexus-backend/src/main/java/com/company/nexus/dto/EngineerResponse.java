package com.company.nexus.dto;

import com.company.nexus.entity.Engineer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngineerResponse {
    private String id;
    private String name;
    private String email;
    private String currentLevel;
    private String track;
    private String team;
    private String managerId;
    private String joinDate;
    private String avatarUrl;

    public static EngineerResponse fromEntity(Engineer engineer) {
        return EngineerResponse.builder()
                .id(engineer.getId().toString())
                .name(engineer.getName())
                .email(engineer.getEmail())
                .currentLevel(engineer.getCurrentLevel().toString())
                .track(engineer.getTrack().toString())
                .team(engineer.getTeam())
                .managerId(engineer.getManagerId())
                .joinDate(engineer.getJoinDate().toString())
                .avatarUrl(engineer.getAvatarUrl())
                .build();
    }
}
