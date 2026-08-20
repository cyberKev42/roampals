package com.example.roampals.services;

import com.example.roampals.dtos.request.DailyActivityImportDTO;
import com.example.roampals.dtos.request.StepsRequestDTO;
import com.example.roampals.dtos.response.DailyActivityDTO;
import com.example.roampals.dtos.response.DailyActivityImportResultDTO;
import com.example.roampals.dtos.response.StepsResponseDTO;
import com.example.roampals.entities.DailyActivity;
import com.example.roampals.entities.User;
import com.example.roampals.repositories.DailyActivityRepository;
import com.example.roampals.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyActivityService {

    private final DailyActivityRepository dailyActivityRepository;
    private final UserRepository userRepository;

    public DailyActivityImportResultDTO importDailyActivities(User user, List<DailyActivityImportDTO> days) {
        int created = 0;
        int updated = 0;
        List<String> errors = new ArrayList<>();
        LocalDate latestDate = null;

        for (DailyActivityImportDTO day : days) {
            try {
                if (day.getDate() == null) {
                    errors.add("Skipped entry with missing date");
                    continue;
                }

                Optional<DailyActivity> existing = dailyActivityRepository.findByUserAndDate(user, day.getDate());
                DailyActivity activity;

                if (existing.isPresent()) {
                    activity = existing.get();
                    updated++;
                } else {
                    activity = new DailyActivity();
                    activity.setUser(user);
                    activity.setDate(day.getDate());
                    activity.setDailyGoalSteps(user.getDailyGoalStepsConfig());
                    created++;
                }

                activity.setDailyStepCount(day.getStepCount());
                activity.setDistanceM((int)day.getDistanceM());
                activity.setCalories((int) Math.round(day.getStepCount() * 0.04));
                activity.setActiveMinutes(day.getStepCount() / 100);

                dailyActivityRepository.save(activity);

                if (latestDate == null || day.getDate().isAfter(latestDate)) {
                    latestDate = day.getDate();
                }
            } catch (Exception e) {
                errors.add(day.getDate() + ": " + e.getMessage());
            }
        }

        if (latestDate != null) {
            refreshStreak(user, latestDate);
            userRepository.save(user);
        }

        return DailyActivityImportResultDTO.builder()
                .totalReceived(days.size())
                .created(created)
                .updated(updated)
                .errors(errors)
                .build();
    }

    public StepsResponseDTO saveSteps(User user, StepsRequestDTO request) {
        Optional<DailyActivity> existing = dailyActivityRepository.findByUserAndDate(user, request.getDate());
        DailyActivity activity;

        if (existing.isPresent()) {
            activity = existing.get();
        } else {
            activity = new DailyActivity();
            activity.setUser(user);
            activity.setDate(request.getDate());
            activity.setDailyGoalSteps(user.getDailyGoalStepsConfig());
        }

        activity.setDailyStepCount(request.getDailySteps());
        activity.setDistanceM(request.getDailySteps() * 0.8);
        activity.setCalories((int) Math.round(request.getDailySteps() * 0.04));
        activity.setActiveMinutes(request.getDailySteps() / 100);
        dailyActivityRepository.save(activity);

        user.setDailyVirtualSteps(request.getDailyVirtualSteps());
        refreshStreak(user, request.getDate());
        userRepository.save(user);

        return StepsResponseDTO.builder()
                .dailySteps(activity.getDailyStepCount())
                .dailyVirtualSteps(user.getDailyVirtualSteps())
                .build();
    }

    public List<DailyActivityDTO> getHistory(User user, int days) {
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusDays(days - 1L);
        return dailyActivityRepository.findByUserAndDateBetweenOrderByDateAsc(user, from, to)
                .stream()
                .map(a -> DailyActivityDTO.builder()
                        .date(a.getDate())
                        .steps(a.getDailyStepCount())
                        .distanceM(a.getDistanceM())
                        .calories(a.getCalories())
                        .activeMinutes(a.getActiveMinutes())
                        .goalSteps(a.getDailyGoalSteps())
                        .build())
                .toList();
    }

    private void refreshStreak(User user, LocalDate mostRecentActivityDate) {
        DailyActivity today = dailyActivityRepository.findByUserAndDate(user, mostRecentActivityDate).orElse(null);
        boolean todayGoalMet = today != null && today.getDailyStepCount() >= today.getDailyGoalSteps();
        LocalDate anchor = todayGoalMet ? mostRecentActivityDate : mostRecentActivityDate.minusDays(1);
        user.setStreakCount(calculateStreakEndingOn(user, anchor));
    }

    private int calculateStreakEndingOn(User user, LocalDate endDate) {
        Map<LocalDate, DailyActivity> byDate = dailyActivityRepository.findAllByUser(user).stream()
                .collect(Collectors.toMap(DailyActivity::getDate, a -> a));

        int streak = 0;
        LocalDate day = endDate;
        DailyActivity activity;
        while ((activity = byDate.get(day)) != null && activity.getDailyStepCount() >= activity.getDailyGoalSteps()) {
            streak++;
            day = day.minusDays(1);
        }
        return streak;
    }

}
