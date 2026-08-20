package com.example.roampals.repositories;

import com.example.roampals.entities.ItemSpawnCondition;
import com.example.roampals.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemSpawnConditionRepository extends JpaRepository<ItemSpawnCondition, Integer> {
    List<ItemSpawnCondition> findByUser_Username(String username);
    List<ItemSpawnCondition> findByUserAndRequiredSteps(User user, int requiredSteps);
}
