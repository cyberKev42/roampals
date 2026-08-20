package com.example.roampals.dtos.response;

import com.example.roampals.entities.Creature;
import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.types.Rarity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreatureResponseDTO {
    private int creatureId;
    private String creatureName;
    private Rarity rarity;
    private String description;
    private String species;

    public CreatureResponseDTO(Creature creature) {
    }
}
