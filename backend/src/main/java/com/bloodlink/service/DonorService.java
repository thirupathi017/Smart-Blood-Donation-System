package com.bloodlink.service;

import com.bloodlink.dto.DonorDTO;
import com.bloodlink.model.DonorProfile;
import com.bloodlink.model.User;
import com.bloodlink.repository.DonorRepository;
import com.bloodlink.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorService {
    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public DonorService(DonorRepository donorRepository, UserRepository userRepository) {
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
    }

    public List<DonorDTO> searchDonors(String bloodGroup, double receiverLat, double receiverLng) {
        List<DonorProfile> profiles = donorRepository.findByBloodGroup(bloodGroup);
        
        return profiles.stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user == null) return null;
                    
                    DonorDTO dto = new DonorDTO(user, profile);
                    
                    // 1. Calculate Distance
                    double distance = calculateDistance(receiverLat, receiverLng, profile.getLatitude(), profile.getLongitude());
                    dto.setDistance(Math.round(distance * 100.0) / 100.0);
                    
                    // 2. Calculate Smart Score
                    double score = calculateSmartScore(user, profile, distance);
                    dto.setScore(score);
                    
                    return dto;
                })
                .filter(dto -> dto != null && dto.getUser().isActive())
                .sorted(Comparator.comparingDouble(DonorDTO::getScore).reversed())
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double calculateSmartScore(User user, DonorProfile profile, double distance) {
        double score = 100.0;

        // Penalty for distance (up to -40 points for 100km+)
        score -= Math.min(distance * 0.4, 40.0);

        // Bonus for reputation (up to +20 points)
        score += (user.getReputationScore() / 5.0);

        // Penalty if donated recently (Auto-cooldown: -50 if < 90 days)
        if (profile.getLastDonationDate() != null) {
            long daysSinceDonation = ChronoUnit.DAYS.between(profile.getLastDonationDate(), LocalDate.now());
            if (daysSinceDonation < 90) {
                score -= 50.0;
            } else {
                score += 10.0; // Bonus for being well-rested
            }
        }

        // Bonus for verification (+15 points)
        if (user.isVerified()) {
            score += 15.0;
        }

        return score;
    }

    public DonorProfile getProfileByUserId(int userId) {
        return donorRepository.findByUserId(userId);
    }

    public void updateAvailability(int userId, boolean available) {
        donorRepository.updateAvailability(userId, available);
    }
    
    public void updateProfileSettings(int userId, boolean feelingHealthy, boolean recentSurgeryTattoo, int preferredDistance, boolean notificationsEnabled) {
        donorRepository.updateProfile(userId, feelingHealthy, recentSurgeryTattoo, preferredDistance, notificationsEnabled);
        
        // Re-evaluate availability if health status changes
        if (!feelingHealthy || recentSurgeryTattoo) {
            updateAvailability(userId, false);
        }
    }
}
