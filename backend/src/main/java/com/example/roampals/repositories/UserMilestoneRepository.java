package com.example.roampals.repositories;

import com.example.roampals.entities.Milestone;
import com.example.roampals.entities.User;
import com.example.roampals.entities.UserMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMilestoneRepository extends JpaRepository<UserMilestone, Integer> {
    Optional<UserMilestone> findByUserAndMilestone(User user, Milestone milestone);
}
