package com.bloodlink.service;

import com.bloodlink.model.DonorProfile;
import com.bloodlink.model.Role;
import com.bloodlink.model.User;
import com.bloodlink.repository.DonorRepository;
import com.bloodlink.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, DonorRepository donorRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(User user, DonorProfile profile) {
        System.out.println("Registering user: " + user.getEmail());
        
        if (user.getRole() == Role.DONOR && (user.getAge() == null || user.getAge() < 18)) {
            throw new RuntimeException("User must be at least 18 years old to register as a donor.");
        }
        
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        System.out.println("User saved. Fetching ID...");
        
        // Fetch the generated user ID
        User savedUser = userRepository.findByEmail(user.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found after saving"));
        
        System.out.println("Saved User ID: " + savedUser.getId());
        
        if (user.getRole() == Role.DONOR && profile != null) {
            if (profile.getWeight() == null || profile.getWeight() < 50) {
                throw new RuntimeException("Donor must weigh at least 50 kg.");
            }
            
            // Check availability auto-block
            boolean isEligible = true;
            if (!profile.getFeelingHealthy() || profile.getRecentSurgeryTattoo()) {
                isEligible = false;
            }
            if (profile.getLastDonationDate() != null) {
                long daysSinceDonation = java.time.temporal.ChronoUnit.DAYS.between(profile.getLastDonationDate(), java.time.LocalDate.now());
                if (daysSinceDonation < 90) {
                    isEligible = false;
                }
            }
            profile.setAvailability(isEligible);
            
            profile.setUserId(savedUser.getId());
            donorRepository.save(profile);
            System.out.println("Donor profile saved.");
        }
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
