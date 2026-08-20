package com.example.roampals.dtos.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ImportRequestDTO {
    private List<DailyActivityImportDTO> days;
}