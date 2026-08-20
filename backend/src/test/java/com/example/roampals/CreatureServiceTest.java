package com.example.roampals;

import com.example.roampals.entities.Creature;
import com.example.roampals.services.CreatureService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.AssertionsKt.assertNotNull;
import static org.junit.jupiter.api.AssertionsKt.assertNull;

// Test-only signing secret; the app requires JWT_TOKEN_SECRET at runtime.
@SpringBootTest(properties = "jwt.token.secret=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")
@RequiredArgsConstructor
public class CreatureServiceTest {

    private final CreatureService creatureService;

//    @Test
//    void testCreatureSpawnWhenStepsAccomplished(){
//        Creature result = creatureService.creatureSpawn(800);
//        assertNotNull(result);
//        System.out.println("Kreatur aufgetaucht: " + result.getCreatureName());
//    }
//
//    @Test
//    void testCreatureSpawnWhenStepsNotEnough(){
//        Creature result = creatureService.creatureSpawn(400);
//        assertNull(result);
//    }
}
