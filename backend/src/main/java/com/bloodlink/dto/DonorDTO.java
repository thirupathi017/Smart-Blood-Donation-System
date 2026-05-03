package com.bloodlink.dto;

import com.bloodlink.model.User;
import com.bloodlink.model.DonorProfile;

public class DonorDTO {
    private User user;
    private DonorProfile profile;
    private double distance;
    private double score; // Smart ranking score

    public DonorDTO(User user, DonorProfile profile) {
        this.user = user;
        this.profile = profile;
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DonorProfile getProfile() { return profile; }
    public void setProfile(DonorProfile profile) { this.profile = profile; }

    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
}
