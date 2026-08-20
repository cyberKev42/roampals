package com.example.roampals.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpawnConditionPayloadDTO {

    private List<CreatureSpawnConditionDTO> creatures;
    private List<ItemSpawnConditionDTO> items;
}
