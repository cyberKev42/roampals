package com.example.roampals.services;

import com.example.roampals.dtos.response.MilestoneProgressDTO;
import com.example.roampals.entities.Milestone;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserMilestone;
import com.example.roampals.repositories.MilestoneRepository;
import com.example.roampals.repositories.UserCreatureRepository;
import com.example.roampals.repositories.UserItemRepository;
import com.example.roampals.repositories.UserMilestoneRepository;
import com.example.roampals.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final UserCreatureRepository userCreatureRepository;
    private final UserItemRepository userItemRepository;
    private final UserMilestoneRepository userMilestoneRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public List<MilestoneProgressDTO> getProgressForUser(User user) {
        List<Milestone> milestones = milestoneRepository.findAll();
        return milestones.stream()
                .map(milestone -> toProgressDto(milestone, user))
                .toList();
    }

    private MilestoneProgressDTO toProgressDto(Milestone milestone, User user) {
        double currentValue = switch (milestone.getMilestoneType()) {
            case STEPS -> userService.getTotalSteps(user);
            case DISTANCE -> userService.getTotalDistance(user);
            case CREATURES -> userCreatureRepository.countDistinctCreatureByUser(user);
            case ITEMS -> userItemRepository.countDistinctItemByUser(user);
        };

        boolean completed = currentValue >= milestone.getGoalCount();
        LocalDate accomplishedDate = completed ? recordAccomplishment(user, milestone) : null;
        boolean marked = user.getMarkedMilestone() != null
                && user.getMarkedMilestone().getMilestoneId() == milestone.getMilestoneId();

        return MilestoneProgressDTO.builder()
                .milestoneId(milestone.getMilestoneId())
                .milestoneName(milestone.getMilestoneName())
                .description(milestone.getDescription())
                .milestoneType(milestone.getMilestoneType().name())
                .goalCount(milestone.getGoalCount())
                .currentValue(currentValue)
                .completed(completed)
                .accomplishedDate(accomplishedDate)
                .marked(marked)
                .build();
    }

    private LocalDate recordAccomplishment(User user, Milestone milestone) {
        return userMilestoneRepository.findByUserAndMilestone(user, milestone)
                .orElseGet(() -> userMilestoneRepository.save(new UserMilestone(0, user, milestone, LocalDate.now())))
                .getAccomplishedDate();
    }

    public MilestoneProgressDTO markMilestone(User user, int milestoneId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));
        boolean alreadyMarked = user.getMarkedMilestone() != null
                && user.getMarkedMilestone().getMilestoneId() == milestoneId;
        user.setMarkedMilestone(alreadyMarked ? null : milestone);
        userRepository.save(user);
        return toProgressDto(milestone, user);
    }
}
