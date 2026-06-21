package com.bloodlink.dto;

public class MLPredictionResponse {
    private boolean is_available;
    private double availability_probability;
    private int estimated_days_until_next_donation;

    public MLPredictionResponse() {}

    public boolean isIs_available() { return is_available; }
    public void setIs_available(boolean is_available) { this.is_available = is_available; }

    public double getAvailability_probability() { return availability_probability; }
    public void setAvailability_probability(double availability_probability) { this.availability_probability = availability_probability; }

    public int getEstimated_days_until_next_donation() { return estimated_days_until_next_donation; }
    public void setEstimated_days_until_next_donation(int estimated_days_until_next_donation) { this.estimated_days_until_next_donation = estimated_days_until_next_donation; }
}
