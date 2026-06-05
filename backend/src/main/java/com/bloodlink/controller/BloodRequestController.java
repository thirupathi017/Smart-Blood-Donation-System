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
    private final com.bloodlink.repository.DonorRepository donorRepository;

    public BloodRequestController(BloodRequestRepository repository, 
                                  com.bloodlink.service.NotificationService notificationService,
                                  com.bloodlink.repository.DonorRepository donorRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.donorRepository = donorRepository;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequest request) {
        if (request.getDonorId() != null) {
            // Validate that the targeted donor is available and not on cooldown
            com.bloodlink.model.DonorProfile targetProfile = donorRepository.findByUserId(request.getDonorId());
            if (targetProfile == null) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Donor not found."));
            }
            boolean isOnCooldown = targetProfile.getLastDonationDate() != null && 
                                 java.time.temporal.ChronoUnit.DAYS.between(targetProfile.getLastDonationDate(), java.time.LocalDate.now()) < 90;
            if (!targetProfile.getAvailability() || isOnCooldown) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "This donor is currently busy, unavailable, or on cooldown and cannot receive requests."));
            }
        }

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
            // Send targeted notification to all matching eligible donors
            List<com.bloodlink.model.DonorProfile> eligibleDonors = donorRepository.findByBloodGroup(request.getBloodGroup());
            for (com.bloodlink.model.DonorProfile donor : eligibleDonors) {
                notificationService.sendNotification(
                    donor.getUserId(),
                    "🚨 Urgent Blood Needed",
                    "Urgent " + request.getBloodGroup() + " blood needed in " + request.getCity() + "!",
                    "EMERGENCY"
                );
            }
        }
        
        return ResponseEntity.ok(java.util.Map.of("message", "Request created successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BloodRequest>> getMyRequests(@RequestParam Integer requesterId) {
        return ResponseEntity.ok(repository.findByRequesterId(requesterId));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<com.bloodlink.dto.BloodRequestDTO>> getNearbyRequests(
            @RequestParam Integer donorUserId,
            @RequestParam String bloodGroup,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        return ResponseEntity.ok(repository.findNearby(donorUserId, bloodGroup, latitude, longitude, 50.0));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Integer id) {
        int deleted = repository.delete(id);
        if (deleted > 0) {
            return ResponseEntity.ok().body(java.util.Map.of("message", "Request deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeRequest(@PathVariable Integer id, @RequestParam Integer donorId) {
        // Update request status to COMPLETED
        repository.updateStatus(id, "COMPLETED");
        
        // Update donor stats (donations + 1, lives impacted + 3)
        donorRepository.recordDonation(donorId);

        // Notify the donor
        notificationService.sendNotification(
            donorId,
            "🎉 Donation Verified!",
            "The receiver has verified your blood donation. Thank you for saving lives! Your stats have been updated.",
            "SYSTEM"
        );
        
        return ResponseEntity.ok(java.util.Map.of("message", "Donation recorded successfully"));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Integer id, @RequestParam Integer donorId, @RequestParam Integer requesterId, @RequestParam String donorName) {
        // Verify donor is allowed to accept requests
        com.bloodlink.model.DonorProfile donor = donorRepository.findByUserId(donorId);
        if (donor == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Donor profile not found"));
        }
        boolean isOnCooldown = donor.getLastDonationDate() != null && 
                             java.time.temporal.ChronoUnit.DAYS.between(donor.getLastDonationDate(), java.time.LocalDate.now()) < 90;
        if (!donor.getAvailability() || isOnCooldown) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "You cannot accept requests while unavailable or on cooldown."));
        }

        int updated = repository.acceptRequest(id, donorId);
        
        if (updated > 0) {
            // Notify the receiver
            notificationService.sendNotification(
                requesterId,
                "🤝 Request Accepted!",
                donorName + " has officially accepted your blood request. You can now chat with them and verify the donation once completed.",
                "SYSTEM"
            );
            return ResponseEntity.ok(java.util.Map.of("message", "Request accepted successfully"));
        } else {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Request is already accepted or invalid"));
        }
    }
}
