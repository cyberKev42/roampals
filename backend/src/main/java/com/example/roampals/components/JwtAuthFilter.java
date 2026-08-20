package com.example.roampals.components;

import com.example.roampals.services.TokenService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component("jwtAuthFilter")
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String jwt;
        String username;

        //Wenn kein Bearer Token vorhanden dann ab zum nächsten Filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("✅ Bearer token found");
        //substring(7) to remove "Bearer " from jwt token
        jwt = authHeader.substring(7);

        try {
            username = tokenService.extractUsername(jwt);
            System.out.println("✅ Extracted username from JWT: " + username);
        } catch (JwtException e) {
            System.out.println("❌ Failed to extract username from JWT: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                System.out.println("✅ Loaded UserDetails: " + userDetails.getUsername());
                if (tokenService.isTokenValid(jwt, userDetails)) {
                    System.out.println("✅ Token is valid!");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("❌ Token validation failed!");
                }
            } catch (Exception e) {
                System.out.println("❌ Failed to load user or validate token: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // Schickt den request zum nächsten Filter weiter
        filterChain.doFilter(request, response);
    }
}
