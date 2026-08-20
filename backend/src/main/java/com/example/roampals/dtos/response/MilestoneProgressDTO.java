package com.example.roampals.dtos.response;

import lombok.*;

import java.time.LocalDate;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MilestoneProgressDTO {
    private int milestoneId;
    private String milestoneName;
    private String description;
    private String milestoneType;
    private double goalCount;
    private double currentValue;
    private boolean completed;
    private LocalDate accomplishedDate;
    private boolean marked;
}
