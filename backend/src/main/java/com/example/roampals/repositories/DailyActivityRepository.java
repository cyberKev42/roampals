package com.example.roampals.repositories;

import com.example.roampals.entities.DailyActivity;
import com.example.roampals.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyActivityRepository extends JpaRepository<DailyActivity, Integer> {
    Optional<DailyActivity> findByUserAndDate(User user, LocalDate date);
    List<DailyActivity> findAllByUser(User user);
    List<DailyActivity> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDate from, LocalDate to);
}
