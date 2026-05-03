package com.bloodlink.controller;

import com.bloodlink.model.BloodRequest;
import com.bloodlink.repository.BloodRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {
    private final BloodRequestRepository repository;
    private final com.bloodlink.service.NotificationService notificationService;

    public BloodRequestController(BloodRequestRepository repository, com.bloodlink.service.NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequest request) {
        repository.save(request);
        
        if (request.getDonorId() != null) {
            // Target specific donor
            notificationService.sendNotification(
                request.getDonorId(),
                "🩸 New Blood Request",
                "A receiver has requested blood from you specifically. Please check your dashboard.",
                "URGENT"
            );
        } else {
            // Broadcast to matching donors
            notificationService.broadcastEmergency(
                request.getBloodGroup(),
                request.getCity(),
                "🚨 Urgent " + request.getBloodGroup() + " blood needed in " + request.getCity() + "!",
                request.getRequesterId()
            );
        }
        
        return ResponseEntity.ok("Request created successfully");
    }

    @GetMapping("/my")
    public ResponseEntity<List<BloodRequest>> getMyRequests(@RequestParam Integer requesterId) {
        return ResponseEntity.ok(repository.findByRequesterId(requesterId));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<com.bloodlink.dto.BloodRequestDTO>> getNearbyRequests(
            @RequestParam String bloodGroup,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        return ResponseEntity.ok(repository.findNearby(bloodGroup, latitude, longitude, 50.0));
    }
}
