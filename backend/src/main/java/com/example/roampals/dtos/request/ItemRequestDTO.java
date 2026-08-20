package com.example.roampals.dtos.request;

import com.example.roampals.types.ItemType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemRequestDTO {
    private String itemName;
    private String description;
    private String imgUrl;
    private ItemType itemType;
    private Double bonusValue;
    private boolean wantToSave;
}
