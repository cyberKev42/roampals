package com.example.roampals.services;

import com.example.roampals.dtos.request.CreatureRequestDTO;
import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.entities.Creature;
import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserCreature;
import com.example.roampals.repositories.CreatureRepository;
import com.example.roampals.repositories.CreatureSpawnConditionRepository;
import com.example.roampals.repositories.UserCreatureRepository;
import com.example.roampals.repositories.UserRepository;
import com.example.roampals.types.Rarity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreatureService {

    private final CreatureRepository creatureRepository;

    // GET
    public CreatureResponseDTO creatureSpawnBySteps(int currentSteps){
        List<CreatureResponseDTO> creatureResponseDTOList = new ArrayList<>();
        creatureRepository.findAll().forEach(creature ->
                creatureResponseDTOList.add(convertCreatureToDTO(creature)));

        if (creatureResponseDTOList.isEmpty()) return null;

        // beim höchsten Ziel anfangen
        if (currentSteps >= 8000) {
             return creatureResponseDTOList.get(3); // Index 3 = aerogon (4. Element)
        }

        if (currentSteps >= 1500) {
            return creatureResponseDTOList.get(2); // Index 2 = kitritual (3. Element)
        }

        if (currentSteps >= 1000) {
            // Bei exakt/ab 1000 Schritten eine zufällige Kreatur aus DB Liste ausgeben
            int randomIndex = (int) (Math.random() * creatureResponseDTOList.size());
            return creatureResponseDTOList.get(randomIndex);
        }
        if (currentSteps >= 5) {
           return creatureResponseDTOList.get(0);
        }
        return null;
    }

    public CreatureResponseDTO getCreatureById(int creatureId){
        Creature creature = creatureRepository.findById(creatureId)
                .orElseThrow(() -> new EntityNotFoundException("Creature not found."));
        CreatureResponseDTO dto = new CreatureResponseDTO();
        dto.setCreatureId(creature.getCreatureId());
        dto.setCreatureName(creature.getCreatureName());
        dto.setRarity(creature.getRarity());
        dto.setDescription(creature.getDescription());
        dto.setSpecies(creature.getSpecies());

        return dto;
    }

    public CreatureResponseDTO convertCreatureToDTO(Creature creature){
        CreatureResponseDTO creatureDTO = new CreatureResponseDTO();

        creatureDTO.setCreatureId(creature.getCreatureId());
        creatureDTO.setCreatureName(creature.getCreatureName());
        creatureDTO.setRarity(creature.getRarity());
        creatureDTO.setDescription(creature.getDescription());
        creatureDTO.setSpecies(creature.getSpecies());

        return creatureDTO;
    }
}
