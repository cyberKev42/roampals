package com.example.roampals.repositories;

import com.example.roampals.entities.User;
import com.example.roampals.entities.UserCreature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCreatureRepository extends JpaRepository<UserCreature, Integer> {
    @Query("SELECT COUNT(DISTINCT uc.creature.creatureId) FROM UserCreature uc WHERE uc.user = :user")
    long countDistinctCreatureByUser(User user);

    // zwischentabellen-einträge für einen bestimmten user
    List<UserCreature> findByUser(User user);
}
