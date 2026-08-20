package com.example.roampals.controller;

import com.example.roampals.dtos.request.AvatarRequestDTO;
import com.example.roampals.dtos.request.ChangePasswordRequestDTO;
import com.example.roampals.dtos.request.DailyGoalRequestDTO;
import com.example.roampals.dtos.request.OnboardingRequestDTO;
import com.example.roampals.dtos.response.UserDTO;
import com.example.roampals.entities.User;
import com.example.roampals.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{nameOrEmail}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String nameOrEmail) {
        return new ResponseEntity<>(userService.getUser(nameOrEmail), HttpStatus.OK);
    }

    @PostMapping("/goal")
    public ResponseEntity<?> updateDailyGoal(@RequestBody DailyGoalRequestDTO request) {
        try {
            User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
            UserDTO result = userService.updateDailyGoal(user, request.getDailyGoalStepsConfig());
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(@RequestBody OnboardingRequestDTO request) {
        try {
            User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
            UserDTO result = userService.completeOnboarding(user, request);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> changeAvatar(@RequestBody AvatarRequestDTO request) {
        try {
            User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
            UserDTO result = userService.changeAvatar(user, request);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO request) {
        try {
            User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
            UserDTO result = userService.changePassword(user, request);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
