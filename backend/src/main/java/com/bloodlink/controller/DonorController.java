package com.bloodlink.controller;

import com.bloodlink.dto.DonorDTO;
import com.bloodlink.service.DonorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<DonorDTO>> searchDonors(
            @RequestParam String bloodGroup,
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(donorService.searchDonors(bloodGroup, lat, lng));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable int userId) {
        var profile = donorService.getProfileByUserId(userId);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/availability/{userId}")
    public ResponseEntity<?> toggleAvailability(
            @PathVariable int userId,
            @RequestParam boolean available) {
        donorService.updateAvailability(userId, available);
        return ResponseEntity.ok(java.util.Map.of("message", "Availability updated", "available", available));
    }

    @PutMapping("/settings/{userId}")
    public ResponseEntity<?> updateSettings(
            @PathVariable int userId,
            @RequestBody com.bloodlink.model.DonorProfile profileUpdates) {
        donorService.updateProfileSettings(
            userId, 
            profileUpdates.getFeelingHealthy(), 
            profileUpdates.getRecentSurgeryTattoo(), 
            profileUpdates.getPreferredDistance(), 
            profileUpdates.getNotificationsEnabled()
        );
        return ResponseEntity.ok(java.util.Map.of("message", "Settings updated successfully"));
    }
}
