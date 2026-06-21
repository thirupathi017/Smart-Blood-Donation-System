package com.bloodlink.service;

import com.bloodlink.dto.MLPredictionRequest;
import com.bloodlink.dto.MLPredictionResponse;
import com.bloodlink.model.DonorProfile;
import com.bloodlink.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class MLPredictionService {

    @Value("${ml.service.url:http://localhost:8000/api/predict}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate;

    public MLPredictionService() {
        this.restTemplate = new RestTemplate();
    }

    public MLPredictionResponse getPredictionForDonor(User user, DonorProfile profile) {
        try {
            int daysSinceLastDonation = 365; // default if never donated
            if (profile.getLastDonationDate() != null) {
                daysSinceLastDonation = (int) ChronoUnit.DAYS.between(profile.getLastDonationDate(), LocalDate.now());
                if (daysSinceLastDonation < 0) daysSinceLastDonation = 0;
            }

            MLPredictionRequest request = new MLPredictionRequest(
                    user.getAge() != null ? user.getAge() : 30,
                    profile.getBloodGroup() != null ? profile.getBloodGroup() : "O+",
                    profile.getTotalDonations() != null ? profile.getTotalDonations() : 0,
                    daysSinceLastDonation,
                    profile.getFeelingHealthy() != null ? profile.getFeelingHealthy() : true,
                    user.getReputationScore()
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<MLPredictionRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.postForEntity(
                    mlServiceUrl, entity, MLPredictionResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch ML prediction: " + e.getMessage());
        }
        
        // Return default/fallback if ML service is unreachable
        MLPredictionResponse fallback = new MLPredictionResponse();
        fallback.setIs_available(profile.getAvailability() != null ? profile.getAvailability() : true);
        fallback.setAvailability_probability(0.5);
        fallback.setEstimated_days_until_next_donation(90);
        return fallback;
    }
}
