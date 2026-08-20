package com.example.roampals.controller;

import com.example.roampals.dtos.request.CreatureRequestDTO;
import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.entities.Creature;
import com.example.roampals.entities.User;
import com.example.roampals.services.CreatureService;
import com.example.roampals.services.UserCreatureService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/creature")
@RequiredArgsConstructor
public class CreatureController {

    private final CreatureService creatureService;
    private final UserCreatureService userCreatureService;

    @GetMapping("/spawn/{steps}")
    public ResponseEntity<CreatureResponseDTO> creatureSpawnBySteps(@PathVariable int steps){
        return new ResponseEntity<>(creatureService.creatureSpawnBySteps(steps), HttpStatus.OK);
    }

    @GetMapping("/{creatureId}")
    public ResponseEntity<CreatureResponseDTO> getCreatureById(@PathVariable("creatureId") int creatureId) {
        System.out.println("Backend empfängt Creature-ID aus URL: " + creatureId);
        CreatureResponseDTO dto = creatureService.getCreatureById(creatureId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveSpawnedCreature(
            @RequestParam("creatureId") int creatureId,
            @RequestBody CreatureRequestDTO response,
            Principal principal)
    {
        if (!response.getWantToSave()){
            return ResponseEntity.ok("Creature not saved.");
        }
        String username = principal.getName();

        return new ResponseEntity<>(userCreatureService.saveSpawnedCreature(username, creatureId, response), HttpStatus.CREATED);
    }



}
