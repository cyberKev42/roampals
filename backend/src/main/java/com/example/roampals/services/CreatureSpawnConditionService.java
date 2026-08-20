package com.example.roampals.services;

import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.dtos.response.CreatureSpawnConditionDTO;
import com.example.roampals.entities.Creature;
import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.entities.ItemSpawnCondition;
import com.example.roampals.entities.User;
import com.example.roampals.repositories.CreatureSpawnConditionRepository;
import com.example.roampals.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CreatureSpawnConditionService {

    private final UserService userService;
    private final CreatureSpawnConditionRepository creatureSpawnConditionRepository;
    private final UserRepository userRepository;
    private final ItemSpawnConditionService itemSpawnConditionService;


    // GET wandelt Map in eine Liste von DTOs um für frontend
    @Transactional(readOnly = true)
    public List<CreatureSpawnConditionDTO> getStaticSpawnConditions(String username) {
        // spawn conditions vom jeweiligen user aus db holen
        // underline _ dient als wegweiser für spring, geht in entity User -> filtert dort nach feld username
        List<CreatureSpawnCondition> userConditions = creatureSpawnConditionRepository.findByUser_Username(username);
        List<CreatureSpawnConditionDTO> dtos = new ArrayList<>();

        // über geladene db conditions iterieren
        for (CreatureSpawnCondition condition : userConditions) {
            CreatureSpawnConditionDTO dto = new CreatureSpawnConditionDTO();
            dto.setRequiredSteps(condition.getRequiredSteps());

            // id der verknüpften creature aus db beziehung holen und als dto zurückgeben
            if (condition.getCreature() != null) {
                dto.setCreatureId(condition.getCreature().getCreatureId());
            }
            dtos.add(dto);
        }
        return dtos;
    }

    public User findByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User " + username + " not found."));
    }

    @Transactional
    public void updateUserSteps(String username, int steps) {
        User user = findByUsername(username);
        user.setDailyVirtualSteps(steps);
        userRepository.save(user);

        int currentSteps = user.getDailyVirtualSteps();

        List<CreatureSpawnCondition> metCreatures =
                creatureSpawnConditionRepository.findByUserAndRequiredSteps(user, currentSteps);

        for (CreatureSpawnCondition condition : metCreatures) {
            if (condition.getCreature() != null) {
                // Kreatur ins Inventar legen
            }
            creatureSpawnConditionRepository.delete(condition);
        }

        // Item-Service aufrufen und den username-String weitergeben
        itemSpawnConditionService.checkAndSpawnItems(username, currentSteps);
    }
}
