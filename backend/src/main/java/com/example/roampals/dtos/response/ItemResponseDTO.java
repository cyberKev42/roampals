package com.example.roampals.dtos.response;

import com.example.roampals.types.ItemType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemResponseDTO {
    private int itemId;
    private String itemName;
    private boolean isActive;
    private String description;
    private ItemType itemType;
    private double bonusValue;
}
