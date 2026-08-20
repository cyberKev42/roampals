package com.example.roampals.dtos.response;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthDTO {
    private int userId;
    private String username;
    private String email;
    private String profilePicture;
    private int totalSteps;
    private double totalDistanceM;
    private int dailyVirtualSteps;
    private String avatar;
    private int dailyGoalStepsConfig;
    private int streakCount;
    private LocalDate createdAt;

    private String role;
    private String jwt;
}

