package com.example.roampals.config;

import com.example.roampals.components.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    //Damit ein Request abgearbeitet werden darf muss er durch alle Filter von SpringSecurity. wenn er einmal abgelehnt wird wird er nicht durchgeführt und alle anderen filter ignoriert
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                //csrf - Cross-Site-Request-Forgery
                .csrf(AbstractHttpConfigurer::disable)
                //Befor dieser Filter ausgeführt wird soll der JWT-Filter überprüft werden
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                //Brauchen wir damit die H2 dargestellt wird
                .headers(AbstractHttpConfigurer::disable)
                //Hier wird konfiguriert wer auf welchen Pfad zugreiffen darf
                // er arbeitet von oben nach unten ab bedeutet wenn man einmal nicht berechtigt ist fliegt man sofort eaus
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/login", "/api/auth/register",
                                "/api/creature", "/api/creature/**", "/api/item/**", "/api/spawn-condition",
                                "/api/spawn-condition/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .build();
    }


    //PermitAll bedeutet jeder darf
//                                .requestMatchers(POST, "api/auth/login").permitAll()
//                        .requestMatchers("api/login").permitAll()
    //authenticated bedeutet es darf jeder der min eingeloggt ist
//                        .requestMatchers(POST, "api/user/profile").authenticated()
    //HasRole und hasAuthority funktionieren im PRinzip beide gleich beide rufen getAuthorities vom UserDetail auf und prüfen ob der Parameter darin vorkommt
//                        .requestMatchers(DELETE, "api/user").hasAuthority("ADMIN")
    //.requestMatchers(DELETE, "api/user").hasRole("ADMIN")
//                        .requestMatchers(PUT, "api/user").hasAnyRole("ADMIN", "MODERATOR")
    //.requestMatchers(PUT, "api/user").hasAnyAuthority("ROLE_ADMIN", "EDIT_USER")





}
