package com.example.roampals.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRequestDTO {
    private String avatar;
    private String profilePicture;
    private int dailyGoalStepsConfig;
}
