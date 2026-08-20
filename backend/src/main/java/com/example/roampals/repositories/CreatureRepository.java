package com.example.roampals.repositories;

import com.example.roampals.entities.Creature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreatureRepository extends JpaRepository<Creature, Integer> {
}
