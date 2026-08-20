package com.example.roampals.dtos.response;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StepsResponseDTO {
    private int dailySteps;
    private int dailyVirtualSteps;
}
