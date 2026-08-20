package com.example.roampals.services;

import com.example.roampals.dtos.request.ItemRequestDTO;
import com.example.roampals.dtos.response.ItemResponseDTO;
import com.example.roampals.entities.Item;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserItem;
import com.example.roampals.repositories.ItemRepository;
import com.example.roampals.repositories.UserItemRepository;
import com.example.roampals.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserItemService {

    private final UserItemRepository userItemRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    // POST
    public String saveSpawnedItem(String username, int itemId, ItemRequestDTO response){
        // UserItem Zwischentabelle (Besitz)
        List<UserItem> userItemList = new ArrayList<>();

        if (!response.isWantToSave()) {
            return null;
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new EntityNotFoundException(("User " + username + " not found.")));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException(("Item " + itemId + " not found.")));
        UserItem userItem = new UserItem();
        userItem.setUser(user);
        userItem.setItem(item);

        userItemList.add(userItem);
        userItemRepository.save(userItem);
        return "Item saved!";
    }

    // GET abfrage vom inventar
    public List<ItemResponseDTO> getUserInventory(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User " + username + " does not exist."));
    List<UserItem> userItems = userItemRepository.findByUser(user);

    List <ItemResponseDTO> inventory = new ArrayList<>();

    for (UserItem useritem : userItems){
        Item item = useritem.getItem();

        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setItemId(item.getItemId());
        dto.setItemName(item.getItemName());
        dto.setActive(item.isActive());
        dto.setItemType(item.getItemType());
        dto.setDescription(item.getDescription());
        dto.setBonusValue(item.getBonusValue());

        inventory.add(dto);
    }
    return inventory;
    }

}
