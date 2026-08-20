package com.example.roampals.dtos.response;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDTO {
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

}
