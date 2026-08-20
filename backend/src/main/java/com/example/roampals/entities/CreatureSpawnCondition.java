package com.example.roampals.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreatureSpawnCondition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int creatureSpawnId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "creature_id")
    private Creature creature;

    private int requiredSteps;
}
