package com.example.roampals.dtos.request;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterDTO {
    private String username;
    private String email;
    private String password;
}

