package com.example.roampals.dtos.request;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LoginDTO {

    //Könnte Username sein oder Email heißt jetzt hier einfach nur username
    private String username;
    private String password;
}
