package com.example.roampals.entities;

import com.example.roampals.types.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String profilePicture;
    private int totalSteps;
    @Column(name = "total_distance_m")
    private double totalDistanceM;
    private int dailyVirtualSteps;
    private String avatar;
    private int dailyGoalStepsConfig;
    private int streakCount;
    @Column(nullable = false)
    private LocalDate createdAt;

    @OneToMany(mappedBy = "user")
    private List<DailyActivity> dailyActivityList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<ItemSpawnCondition> itemSpawnConditionList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<CreatureSpawnCondition> creatureSpawnConditionList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserItem> userItemList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserCreature> userCreatureList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "marked_milestone_id")
    private Milestone markedMilestone;

    public User(int userId, String username, String email, String password, String profilePicture, int totalSteps, double totalDistanceM, int dailyVirtualSteps, String avatar, int dailyGoalStepsConfig, int streakCount, LocalDate createdAt, UserRole userRole) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
        this.totalSteps = totalSteps;
        this.totalDistanceM = totalDistanceM;
        this.dailyVirtualSteps = dailyVirtualSteps;
        this.avatar = avatar;
        this.dailyGoalStepsConfig = dailyGoalStepsConfig;
        this.streakCount = streakCount;
        this.createdAt = createdAt;
        this.userRole = userRole;
    }

    // Ab hier spring.security Implementierung
    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole;

    @Column(nullable = false)
    private boolean enabled;

    public User(String username, String email, String password, UserRole userRole) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.userRole = userRole;
        //Jeder neuer User ist immer sofort enabled, man könnte das auch anders einstellen bzw. hier auch anderen SpringSecurity properties verwenden z.B AccountExpired etc.
        this.enabled = true;
        this.createdAt = LocalDate.now();
    }

    //Hier werden die Berechtigungen des Users geladen WICHTIG!!! die Role ist auch eine Berechtigung.
    //In diesem Beispiel ist die einzige Berechtigung, die ein User hat, seine Rolle man könnte es aber auch um eigene Berechtigungen erweitern
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(userRole.toString()));
        return authorityList;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }


}
