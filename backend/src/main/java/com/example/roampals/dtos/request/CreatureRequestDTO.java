package com.example.roampals.dtos.request;

import com.example.roampals.types.Rarity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CreatureRequestDTO {
    private String creatureName;
    private Rarity rarity;
    private Boolean wantToSave;
    private String description;
    private String species;
}
