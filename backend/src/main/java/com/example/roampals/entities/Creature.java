package com.example.roampals.entities;

import com.example.roampals.types.Rarity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table
public class Creature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int creatureId;

    @Column(unique = true)
    private String creatureName;

    @Enumerated(EnumType.STRING)
    private Rarity rarity;

    @OneToMany(mappedBy = "creature")
    private List<CreatureSpawnCondition> creatureSpawnConditionList = new ArrayList<>();

    @OneToMany(mappedBy = "creature")
    private List<UserCreature> userCreatureList = new ArrayList<>();

    @Column(length = 255)
    private String description;

    private String species;

}
