package com.example.roampals.controller;

import com.example.roampals.dtos.request.DailyActivityImportDTO;
import com.example.roampals.dtos.request.ImportRequestDTO;
import com.example.roampals.dtos.request.StepsRequestDTO;
import com.example.roampals.dtos.response.DailyActivityDTO;
import com.example.roampals.dtos.response.DailyActivityImportResultDTO;
import com.example.roampals.dtos.response.StepsResponseDTO;
import com.example.roampals.entities.User;
import com.example.roampals.services.DailyActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/daily-activity")
@RequiredArgsConstructor
public class DailyActivityController {

    private final DailyActivityService dailyActivityService;

    @PostMapping("import")
    public ResponseEntity<?> importDailyActivities(@RequestBody ImportRequestDTO request) {

        List<DailyActivityImportDTO> days = request.getDays();
        DailyActivityImportResultDTO result;

        System.out.println(request.getDays());

        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            result = dailyActivityService.importDailyActivities(user, days);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400
        }
        return new ResponseEntity<>(result, HttpStatus.OK); // 200
    }

    @PostMapping("steps")
    public ResponseEntity<?> saveSteps(@RequestBody StepsRequestDTO request) {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            StepsResponseDTO result = dailyActivityService.saveSteps(user, request);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("history")
    public ResponseEntity<?> getHistory(@RequestParam(defaultValue = "30") int days) {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<DailyActivityDTO> result = dailyActivityService.getHistory(user, days);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

//    @PostMapping("/import")
//    public ResponseEntity<?> importDailyActivities(
//            @RequestBody(required = false) String body) {
//
//        System.out.println("BODY:");
//        System.out.println(body);
//
//        return ResponseEntity.ok().build();
//    }

}
