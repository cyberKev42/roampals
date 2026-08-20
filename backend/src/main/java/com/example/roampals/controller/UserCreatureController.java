package com.example.roampals.controller;

import com.example.roampals.dtos.response.CreatureResponseDTO;
import com.example.roampals.services.UserCreatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/creature")
@RequiredArgsConstructor
public class UserCreatureController {

    private final UserCreatureService userCreatureService;

    @GetMapping("/inventory")
    public ResponseEntity<List<CreatureResponseDTO>> getUserInventory(Principal principal){
        String username = principal.getName();
        List<CreatureResponseDTO> inventory = userCreatureService.getUserInventory(username);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }
}

