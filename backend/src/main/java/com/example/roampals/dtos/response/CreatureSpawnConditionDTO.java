package com.example.roampals.dtos.response;

import com.example.roampals.entities.CreatureSpawnCondition;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class CreatureSpawnConditionDTO {
    private int requiredSteps;
    private int creatureId;

    public CreatureSpawnConditionDTO(CreatureSpawnCondition condition){
        this.requiredSteps = condition.getRequiredSteps();
        this.creatureId = condition.getCreature().getCreatureId();
    }

    public String getType() {
        return "CREATURE";
    }
}
