package com.example.roampals.entities;

import com.example.roampals.types.ItemType;
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
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemId;
    @Column(unique = true)
    private String itemName;
    private String description;
    private boolean isActive;
    private String imgUrl;
    @Enumerated(EnumType.STRING)
    private ItemType itemType;
    private double bonusValue;

    @OneToMany(mappedBy = "item")
    private List<ItemSpawnCondition> itemSpawnConditionList = new ArrayList<>();

    @OneToMany(mappedBy = "item")
    private List<UserItem> userItemList = new ArrayList<>();

}
