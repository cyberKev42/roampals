package com.example.roampals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Test-only signing secret; the app requires JWT_TOKEN_SECRET at runtime.
@SpringBootTest(properties = "jwt.token.secret=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")
class RoampalsApplicationTests {

    @Test
    void contextLoads() {
    }

}
