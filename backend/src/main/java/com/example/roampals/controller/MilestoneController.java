package com.example.roampals.controller;

import com.example.roampals.dtos.response.MilestoneProgressDTO;
import com.example.roampals.entities.User;
import com.example.roampals.services.MilestoneService;
import com.example.roampals.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;
    private final UserService userService;

    @GetMapping("/{nameOrEmail}")
    public ResponseEntity<List<MilestoneProgressDTO>> getProgress(@PathVariable String nameOrEmail) {
        User user = userService.getUserEntity(nameOrEmail);
        return new ResponseEntity<>(milestoneService.getProgressForUser(user), HttpStatus.OK);
    }

    @PostMapping("/{milestoneId}/mark")
    public ResponseEntity<?> markMilestone(@PathVariable int milestoneId) {
        try {
            User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
            MilestoneProgressDTO result = milestoneService.markMilestone(user, milestoneId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
