package com.example.roampals.controller;

import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.dtos.response.CreatureSpawnConditionDTO;
import com.example.roampals.dtos.response.ItemSpawnConditionDTO;
import com.example.roampals.dtos.response.SpawnConditionPayloadDTO;
import com.example.roampals.entities.Creature;
import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.entities.User;
import com.example.roampals.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/spawn-condition")
public class CreatureSpawnConditionController {

    private final CreatureSpawnConditionService creatureSpawnConditionService;
    private final ItemSpawnConditionService itemSpawnConditionService;

    @GetMapping
    public ResponseEntity<List<Object>> getSpawnCondition(Principal principal){
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String username = principal.getName();

        List<CreatureSpawnConditionDTO> creatureList =
                creatureSpawnConditionService.getStaticSpawnConditions(username);

        List<ItemSpawnConditionDTO> itemList =
                itemSpawnConditionService.getStaticSpawnConditions(username);
        List<Object> combinedList = new ArrayList<>();
        combinedList.add(creatureList);
        combinedList.add(itemList);
        return new ResponseEntity<>(combinedList, HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateSteps(@RequestParam("steps") int steps, Principal principal){
        String username = principal.getName();
        creatureSpawnConditionService.updateUserSteps(username, steps);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
