package com.example.roampals.entities;

import com.example.roampals.types.MilestoneType;
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
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int milestoneId;
    @Column(unique = true)
    private String milestoneName;
    private String description;

    @Enumerated(EnumType.STRING)
    private MilestoneType milestoneType;
    private double goalCount;

    @OneToMany(mappedBy = "milestone")
    private List<UserMilestone> userMilestoneList = new ArrayList<>();

    @OneToMany(mappedBy = "markedMilestone")
    private List<User> users = new ArrayList<>();
}
