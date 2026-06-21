package com.bloodlink.dto;

public class MLPredictionRequest {
    private Integer age;
    private String blood_group;
    private Integer total_donations;
    private Integer days_since_last_donation;
    private Boolean feeling_healthy;
    private Integer reputation_score;

    public MLPredictionRequest() {}

    public MLPredictionRequest(Integer age, String blood_group, Integer total_donations, Integer days_since_last_donation, Boolean feeling_healthy, Integer reputation_score) {
        this.age = age;
        this.blood_group = blood_group;
        this.total_donations = total_donations;
        this.days_since_last_donation = days_since_last_donation;
        this.feeling_healthy = feeling_healthy;
        this.reputation_score = reputation_score;
    }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getBlood_group() { return blood_group; }
    public void setBlood_group(String blood_group) { this.blood_group = blood_group; }

    public Integer getTotal_donations() { return total_donations; }
    public void setTotal_donations(Integer total_donations) { this.total_donations = total_donations; }

    public Integer getDays_since_last_donation() { return days_since_last_donation; }
    public void setDays_since_last_donation(Integer days_since_last_donation) { this.days_since_last_donation = days_since_last_donation; }

    public Boolean getFeeling_healthy() { return feeling_healthy; }
    public void setFeeling_healthy(Boolean feeling_healthy) { this.feeling_healthy = feeling_healthy; }

    public Integer getReputation_score() { return reputation_score; }
    public void setReputation_score(Integer reputation_score) { this.reputation_score = reputation_score; }
}
