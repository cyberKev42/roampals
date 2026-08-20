package com.example.roampals.controller;

import com.example.roampals.dtos.request.CreatureRequestDTO;
import com.example.roampals.dtos.request.ItemRequestDTO;
import com.example.roampals.dtos.response.ItemResponseDTO;
import com.example.roampals.entities.Item;
import com.example.roampals.entities.User;
import com.example.roampals.services.ItemService;
import com.example.roampals.services.UserItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/item")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final UserItemService userItemService;

    @PostMapping("/save")
    public ResponseEntity<?> saveSpawnedItem(
            @RequestParam("itemId") int itemId,
            @RequestBody ItemRequestDTO response,
            Principal principal)
    {
        if (!response.isWantToSave()){
            return ResponseEntity.ok("Item not saved.");
        }
        String username = principal.getName();

        return new ResponseEntity<>(userItemService.saveSpawnedItem(username, itemId, response), HttpStatus.CREATED);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable int itemId){
        System.out.println("Backend empfängt Item-Id aus URL: " + itemId);
    ItemResponseDTO dto = itemService.getItemById(itemId);
    return ResponseEntity.ok(dto);
    }

}

