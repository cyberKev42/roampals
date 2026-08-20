package com.example.roampals.controller;

import com.example.roampals.dtos.request.LoginDTO;
import com.example.roampals.dtos.request.RegisterDTO;
import com.example.roampals.dtos.response.AuthDTO;
import com.example.roampals.exceptions.UserAlreadyExistsException;
import com.example.roampals.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO){
        System.out.println("auth controller");
        AuthDTO authDTO;

        try {
            authDTO = userService.login(loginDTO);
        }catch (UsernameNotFoundException e){
            return  new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401
        }  catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400
        }
        return new ResponseEntity<>(authDTO, HttpStatus.OK); // 200
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO){

        AuthDTO authDTO;

        try {
            authDTO = userService.register(registerDTO);
        }catch (UserAlreadyExistsException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // 409
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400
        }
        return new ResponseEntity<>(authDTO, HttpStatus.CREATED); // 201
    }
}
