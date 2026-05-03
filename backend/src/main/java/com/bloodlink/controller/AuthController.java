package com.bloodlink.controller;

import com.bloodlink.dto.LoginRequest;
import com.bloodlink.dto.RegisterRequest;
import com.bloodlink.model.DonorProfile;
import com.bloodlink.model.Role;
import com.bloodlink.model.User;
import com.bloodlink.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final com.bloodlink.security.JwtUtils jwtUtils;

    public AuthController(AuthService authService, com.bloodlink.security.JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.bloodlink.dto.RegisterRequest request) {
        // ... same as before
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setAge(request.getAge());
        user.setRole(request.getRole());
        user.setVerified(false);
        user.setActive(true);
        user.setReputationScore(100);

        DonorProfile profile = null;
        if (request.getRole() == Role.DONOR) {
            profile = new DonorProfile();
            profile.setBloodGroup(request.getBloodGroup());
            profile.setCity(request.getCity());
            profile.setLatitude(request.getLatitude());
            profile.setLongitude(request.getLongitude());
            profile.setLastDonationDate(request.getLastDonationDate());
            profile.setWeight(request.getWeight());
            profile.setFeelingHealthy(request.getFeelingHealthy() != null ? request.getFeelingHealthy() : true);
            profile.setRecentSurgeryTattoo(request.getRecentSurgeryTattoo() != null ? request.getRecentSurgeryTattoo() : false);
            profile.setPreferredDistance(50);
            profile.setNotificationsEnabled(true);
            profile.setTotalDonations(0);
            profile.setLivesImpacted(0);
            profile.setRating(5.0);
            
            // Availability is checked in AuthService
            profile.setAvailability(true);
        }

        try {
            authService.register(user, profile);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.authenticate(request.getEmail(), request.getPassword());
            String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(new com.bloodlink.dto.AuthResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
