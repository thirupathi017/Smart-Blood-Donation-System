package com.bloodlink.model;

import java.time.LocalDate;

public class DonorProfile {
    private Integer id;
    private Integer userId;
    private String bloodGroup;
    private String city;
    private Double latitude;
    private Double longitude;
    private Boolean availability;
    private LocalDate lastDonationDate;
    
    // New fields for advanced validation and features
    private Integer weight;
    private Boolean feelingHealthy;
    private Boolean recentSurgeryTattoo;
    private Integer preferredDistance;
    private Boolean notificationsEnabled;
    private Integer totalDonations;
    private Integer livesImpacted;
    private Double rating;
    
    // AI Score (Transient, used for ranking)
    private Double aiScore;

    public DonorProfile() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }

    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
    
    public Integer getWeight() { return weight; }
    public void setWeight(Integer weight) { this.weight = weight; }
    
    public Boolean getFeelingHealthy() { return feelingHealthy; }
    public void setFeelingHealthy(Boolean feelingHealthy) { this.feelingHealthy = feelingHealthy; }
    
    public Boolean getRecentSurgeryTattoo() { return recentSurgeryTattoo; }
    public void setRecentSurgeryTattoo(Boolean recentSurgeryTattoo) { this.recentSurgeryTattoo = recentSurgeryTattoo; }
    
    public Integer getPreferredDistance() { return preferredDistance; }
    public void setPreferredDistance(Integer preferredDistance) { this.preferredDistance = preferredDistance; }
    
    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
    
    public Integer getTotalDonations() { return totalDonations; }
    public void setTotalDonations(Integer totalDonations) { this.totalDonations = totalDonations; }
    
    public Integer getLivesImpacted() { return livesImpacted; }
    public void setLivesImpacted(Integer livesImpacted) { this.livesImpacted = livesImpacted; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Double getAiScore() { return aiScore; }
    public void setAiScore(Double aiScore) { this.aiScore = aiScore; }
}
