package com.example.roampals.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvatarRequestDTO {
    private String avatar;
    private String profilePicture;
}
