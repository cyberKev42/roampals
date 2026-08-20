package com.example.roampals.repositories;

import com.example.roampals.entities.CreatureSpawnCondition;
import com.example.roampals.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CreatureSpawnConditionRepository extends JpaRepository<CreatureSpawnCondition, Integer> {

    @Query("SELECT c FROM CreatureSpawnCondition c WHERE c.creatureSpawnId = 1")
    CreatureSpawnCondition findCurrentDailyCondition();
    // underline _ dient als wegweiser für spring, geht in entity User -> filtert dort nach feld username
    List<CreatureSpawnCondition> findByUser_Username(String username);
    List<CreatureSpawnCondition> findByUserAndRequiredSteps(User user, int requiredSteps);
}
