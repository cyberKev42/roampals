package com.example.roampals.dtos.response;

import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.entities.ItemSpawnCondition;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemSpawnConditionDTO {
    private int requiredSteps;
    private int itemId;

    public ItemSpawnConditionDTO(ItemSpawnCondition condition){
        this.requiredSteps = condition.getRequiredSteps();
        this.itemId = condition.getItem().getItemId();
    }

    public String getType(){
        return "ITEM";
    }

}
