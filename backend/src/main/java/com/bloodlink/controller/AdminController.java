package com.bloodlink.controller;

import com.bloodlink.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAllNonAdmins());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable int id, @RequestParam boolean active) {
        userRepository.updateStatus(id, active);
        return ResponseEntity.ok("User status updated");
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<?> verifyUser(@PathVariable int id, @RequestParam boolean verified) {
        userRepository.updateVerification(id, verified);
        return ResponseEntity.ok("User verification updated");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(userRepository.getStats());
    }
}
