package com.example.roampals.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"}))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailyActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dailyActivityId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate date;
    private int dailyStepCount;
    @Column(name = "distance_m")
    private double distanceM;
    private int calories;
    private int activeMinutes;
    private int dailyGoalSteps;
}
