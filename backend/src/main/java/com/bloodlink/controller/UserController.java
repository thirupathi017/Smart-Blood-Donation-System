package com.bloodlink.controller;

import com.bloodlink.model.User;
import com.bloodlink.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            userRepository.deleteById(userOptional.get().getId());
            return ResponseEntity.ok("Account deleted successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
