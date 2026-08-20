package com.example.roampals.services;

import com.example.roampals.dtos.request.ItemRequestDTO;
import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.dtos.response.ItemResponseDTO;
import com.example.roampals.entities.Creature;
import com.example.roampals.entities.Item;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserItem;
import com.example.roampals.repositories.ItemRepository;
import com.example.roampals.repositories.UserItemRepository;
import com.example.roampals.types.ItemType;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;

    // GET
    public ItemResponseDTO getItemById(int itemId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found."));
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setItemId(item.getItemId());
        dto.setItemName(item.getItemName());
        dto.setItemType(item.getItemType());
        dto.setActive(item.isActive());
        dto.setDescription(item.getDescription());
        dto.setBonusValue(item.getBonusValue());

        return dto;
    }
    public ItemResponseDTO convertItemToDTO(Item item){
        ItemResponseDTO itemDTO = new ItemResponseDTO();

        itemDTO.setItemName(item.getItemName());
        itemDTO.setDescription(item.getDescription());
        itemDTO.setItemType(item.getItemType());
        itemDTO.setActive(item.isActive());
        itemDTO.setBonusValue(item.getBonusValue());

        return itemDTO;
    }
}
