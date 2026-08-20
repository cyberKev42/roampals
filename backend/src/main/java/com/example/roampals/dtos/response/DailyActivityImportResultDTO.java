package com.example.roampals.dtos.response;

import lombok.*;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DailyActivityImportResultDTO {
    private int totalReceived;
    private int created;
    private int updated;
    private List<String> errors;
}
