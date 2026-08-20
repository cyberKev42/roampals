package com.example.roampals.services;

import com.example.roampals.dtos.request.AvatarRequestDTO;
import com.example.roampals.dtos.request.ChangePasswordRequestDTO;
import com.example.roampals.dtos.request.LoginDTO;
import com.example.roampals.dtos.request.OnboardingRequestDTO;
import com.example.roampals.dtos.request.RegisterDTO;
import com.example.roampals.dtos.response.AuthDTO;
import com.example.roampals.dtos.response.UserDTO;
import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.entities.DailyActivity;
import com.example.roampals.entities.ItemSpawnCondition;
import com.example.roampals.entities.User;
import com.example.roampals.exceptions.EmptyOptionalException;
import com.example.roampals.exceptions.UserAlreadyExistsException;
import com.example.roampals.repositories.*;
import com.example.roampals.types.UserRole;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final ConversionService conversionService;
    private final PasswordEncoder passwordEncoder;
    private final DailyActivityRepository dailyActivityRepository;
    private final CreatureSpawnConditionRepository creatureSpawnRepository;
    private final ItemSpawnConditionRepository itemSpawnRepository;
    private final CreatureRepository creatureRepository;
    private final ItemRepository itemRepository;
    private final SpawnService spawnService;

    public AuthDTO login(LoginDTO loginDTO){
        System.out.println("userservice login " + loginDTO);
        User user = getUserByUsernameOrEmail(loginDTO);
        String username = user.getUsername();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, loginDTO.getPassword()));

        String jwt = tokenService.generateTokenWithClaims(user);

        return new AuthDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getTotalSteps(),
                user.getTotalDistanceM(),
                user.getDailyVirtualSteps(),
                user.getAvatar(),
                user.getDailyGoalStepsConfig(),
                user.getStreakCount(),
                user.getCreatedAt(),
                user.getUserRole().getLabel(),
                jwt
        );

    }

    public AuthDTO register(RegisterDTO registerDTO) throws UserAlreadyExistsException {

        if (userRepository.findByUsernameOrEmail(registerDTO.getUsername(), registerDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Username or email already in use");
        }

        User user = new User(registerDTO.getUsername(), registerDTO.getEmail(), passwordEncoder.encode(registerDTO.getPassword()), UserRole.USER);
        userRepository.save(user);

        // hier beim neuen user das service aufrufen
        SpawnService.CREATURE_TEMP.forEach((steps, creatureId) -> {
            CreatureSpawnCondition condition = new CreatureSpawnCondition();
            condition.setUser(user);
            condition.setRequiredSteps(steps);
            condition.setCreature(creatureRepository.getReferenceById(creatureId));

            creatureSpawnRepository.save(condition);
        });

        SpawnService.ITEM_TEMP.forEach((steps, itemId) -> {
            ItemSpawnCondition condition = new ItemSpawnCondition();
            condition.setUser(user);
            condition.setRequiredSteps(steps);
            condition.setItem(itemRepository.getReferenceById(itemId));

            itemSpawnRepository.save(condition);
        });

        String jwt = tokenService.generateTokenWithClaims(user);

        return new AuthDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getTotalSteps(),
                user.getTotalDistanceM(),
                user.getDailyVirtualSteps(),
                user.getAvatar(),
                user.getDailyGoalStepsConfig(),
                user.getStreakCount(),
                user.getCreatedAt(),
                user.getUserRole().getLabel(),
                jwt
        );
    }

    private UserDTO entityToDto(User user) {

        return UserDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .totalSteps(user.getTotalSteps())
                .totalDistanceM(user.getTotalDistanceM())
                .avatar(user.getAvatar())
                .dailyVirtualSteps(user.getDailyVirtualSteps())
                .dailyGoalStepsConfig(user.getDailyGoalStepsConfig())
                .streakCount(user.getStreakCount())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserDTO getUser(String nameOrEmail) {
        User user = getUserFromOptional(userRepository.findByUsernameOrEmail(nameOrEmail, nameOrEmail));
        user.setTotalSteps(getTotalSteps(user));
        user.setTotalDistanceM(getTotalDistance(user));
        userRepository.save(user);
        return entityToDto(user);
    }

    public User getUserEntity(String nameOrEmail) {
        return getUserFromOptional(userRepository.findByUsernameOrEmail(nameOrEmail, nameOrEmail));
    }

    public int getTotalSteps(User user) {
        List<DailyActivity> allActivities = dailyActivityRepository.findAllByUser(user);
        int totalSteps = 0;

        for (DailyActivity activity : allActivities) {
            totalSteps += activity.getDailyStepCount();
        }
        return totalSteps;
    }

    public double getTotalDistance(User user) {
        List<DailyActivity> allActivities = dailyActivityRepository.findAllByUser(user);
        double totalDistance = 0;

        for (DailyActivity activity : allActivities) {
            totalDistance += activity.getDistanceM();
        }
        return totalDistance;
    }

    // Die zwei folgenden Methoden sind nur fancy um sich leichet zu tun beim auslesen aus der Datenbank und das Option zu überprüfen
    public User getUserByUsernameOrEmail(LoginDTO loginDTO){
        return getUserFromOptional(
                userRepository.findByUsernameOrEmail(loginDTO.getUsername(), loginDTO.getUsername())
        );
    }

    public User getUserFromOptional(Optional<User> userOptional){
        User user;
        try {
            user = conversionService.getEntityFromOptional(userOptional);
        }catch (EmptyOptionalException e){
            throw new UsernameNotFoundException("Kein entsprechender User in der Datenbank gefunden!");
        }
        return user;
    }

    public UserDTO updateDailyGoal(User user, int newGoal) {
        if (newGoal < 500) {
            throw new IllegalArgumentException("Daily goal must be at least 500 steps");
        }

        user.setDailyGoalStepsConfig(newGoal);
        userRepository.save(user);

        Optional<DailyActivity> todayActivity = dailyActivityRepository.findByUserAndDate(user, LocalDate.now());
        if (todayActivity.isPresent()) {
            DailyActivity activity = todayActivity.get();
            activity.setDailyGoalSteps(newGoal);
            dailyActivityRepository.save(activity);
        }

        return entityToDto(user);
    }

    public UserDTO completeOnboarding(User user, OnboardingRequestDTO request) {
        if (request.getDailyGoalStepsConfig() < 500) {
            throw new IllegalArgumentException("Daily goal must be at least 500 steps");
        }
        user.setAvatar(request.getAvatar());
        user.setProfilePicture(request.getProfilePicture());
        user.setDailyGoalStepsConfig(request.getDailyGoalStepsConfig());
        userRepository.save(user);
        return entityToDto(user);
    }

    public UserDTO changeAvatar(User user, AvatarRequestDTO request) {
        user.setAvatar(request.getAvatar());
        user.setProfilePicture(request.getProfilePicture());
        userRepository.save(user);
        return entityToDto(user);
    }

    public UserDTO changePassword(User user, ChangePasswordRequestDTO request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("New password must not be blank");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return entityToDto(user);
    }

    public User findByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User " + username + " not found."));
    }
}

