package com.example.roampals.controller;

import com.example.roampals.dtos.response.ItemResponseDTO;
import com.example.roampals.services.UserItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/item")
public class UserItemController {

    private final UserItemService userItemService;

    @GetMapping("/inventory")
    public ResponseEntity<List<ItemResponseDTO>> getUserInventory (Principal principal) {
        String username = principal.getName();
        List<ItemResponseDTO> inventory = userItemService.getUserInventory(username);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }
}
