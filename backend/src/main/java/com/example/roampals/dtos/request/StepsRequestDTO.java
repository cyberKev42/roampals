package com.example.roampals.dtos.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

// No @Builder/@AllArgsConstructor: same reasoning as DailyActivityImportDTO — this is
// deserialized from client JSON via Jackson's no-args-constructor + setter path.
@NoArgsConstructor
@Getter
@Setter
public class StepsRequestDTO {
    private int dailySteps;
    private int dailyVirtualSteps;
    private LocalDate date;
}
