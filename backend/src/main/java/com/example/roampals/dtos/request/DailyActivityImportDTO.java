package com.example.roampals.dtos.request;

import lombok.*;

import java.time.LocalDate;

// No @Builder/@AllArgsConstructor: this DTO is only ever deserialized from client JSON via
// Jackson's no-args-constructor + setter path. Adding an all-args constructor makes Jackson 3.x
// pick it as the creator, which fails on primitives when a field (e.g. activeMinutes) is omitted.
@NoArgsConstructor
@Getter
@Setter
public class DailyActivityImportDTO {
    private LocalDate date;
    private int stepCount;
    private double distanceM;
    private Integer calories;
    private Integer activeMinutes;
}
