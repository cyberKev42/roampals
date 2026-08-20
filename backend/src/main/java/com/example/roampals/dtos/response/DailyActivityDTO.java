package com.example.roampals.dtos.response;

import lombok.*;

import java.time.LocalDate;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DailyActivityDTO {
    private LocalDate date;
    private int steps;
    private double distanceM;
    private int calories;
    private int activeMinutes;
    private int goalSteps;
}
