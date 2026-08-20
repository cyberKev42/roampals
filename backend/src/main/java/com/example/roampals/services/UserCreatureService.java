package com.example.roampals.services;

import com.example.roampals.dtos.request.CreatureRequestDTO;
import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.entities.Creature;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserCreature;
import com.example.roampals.repositories.CreatureRepository;
import com.example.roampals.repositories.UserCreatureRepository;
import com.example.roampals.repositories.UserRepository;
import com.example.roampals.types.Rarity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCreatureService {

    private final UserCreatureRepository userCreatureRepository;
    private final CreatureRepository creatureRepository;
    private final UserRepository userRepository;

    public List<UserCreature> userCreatureList = new ArrayList<>();

    // POST
    public String saveSpawnedCreature(String username, int creatureId, CreatureRequestDTO response){
        // UserCreature Zwischentabelle (Besitz)
        List<UserCreature> userCreatureList = new ArrayList<>();

        if (!response.getWantToSave()) {
            return null;
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException(("User " + username + " not found.")));
        Creature creature = creatureRepository.findById(creatureId)
                .orElseThrow(() -> new EntityNotFoundException(("Creature " + creatureId + " not found.")));
        UserCreature userCreature = new UserCreature();
        userCreature.setUser(user);
        userCreature.setCreature(creature);

        userCreatureList.add(userCreature);
        userCreatureRepository.save(userCreature);
        return "Creature saved!";
    }


    // GET fragt inventar von user ab
    public List<CreatureResponseDTO> getUserInventory(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User " + username + " does not exist."));
        // liste aller einträge von zwischentabelle (besitz von kreaturen zu user)
        List<UserCreature> userCreatures = userCreatureRepository.findByUser(user);

        // neue leere liste für dtos
        List<CreatureResponseDTO> inventory = new ArrayList<>();

        for (UserCreature usercreature : userCreatures){
            Creature creature = usercreature.getCreature();

            CreatureResponseDTO dto = new CreatureResponseDTO();
            dto.setCreatureId(creature.getCreatureId());
            dto.setCreatureName(creature.getCreatureName());
            dto.setRarity(creature.getRarity());
            dto.setDescription(creature.getDescription());
            dto.setSpecies(creature.getSpecies());
            inventory.add(dto);
        }
        return inventory;
    }

}
