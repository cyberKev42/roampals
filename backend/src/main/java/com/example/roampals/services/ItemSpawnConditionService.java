package com.example.roampals.services;

import com.example.roampals.dtos.response.ItemSpawnConditionDTO;
import com.example.roampals.entities.ItemSpawnCondition;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserItem;
import com.example.roampals.repositories.ItemSpawnConditionRepository;
import com.example.roampals.repositories.UserItemRepository;
import com.example.roampals.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemSpawnConditionService {

    private final UserService userService;
    private final ItemSpawnConditionRepository itemSpawnConditionRepository;
    private final UserRepository userRepository;
    private final UserItemRepository userItemRepository;

    @Transactional(readOnly = true)
    public List<ItemSpawnConditionDTO> getStaticSpawnConditions (String username){
        List<ItemSpawnCondition>  userConditions = itemSpawnConditionRepository.findByUser_Username(username);
        List<ItemSpawnConditionDTO> dtos = new ArrayList<>();

        for(ItemSpawnCondition condition: userConditions){
            ItemSpawnConditionDTO dto = new ItemSpawnConditionDTO();
            dto.setRequiredSteps(condition.getRequiredSteps());

            if (condition.getItem() != null) {
                dto.setItemId(condition.getItem().getItemId());
            }
            dtos.add(dto);
        }
        return dtos;
    }
    @Transactional
    public void checkAndSpawnItems(String username, int currentSteps) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User " + username + " not found."));
        // Alle erfüllten Item-Bedingungen holen
        List<ItemSpawnCondition> metConditions =
                itemSpawnConditionRepository.findByUserAndRequiredSteps(user, currentSteps);

        for (ItemSpawnCondition condition : metConditions) {
            if (condition.getItem() != null) {
                UserItem inventoryEntry = new UserItem();
                inventoryEntry.setUser(user);
                inventoryEntry.setItem(condition.getItem());

                userItemRepository.save(inventoryEntry);
            }
            // Bedingung löschen, damit sie nicht doppelt triggert
            itemSpawnConditionRepository.delete(condition);
        }
    }
}
