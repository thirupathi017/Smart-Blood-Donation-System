package com.bloodlink.model;

import java.time.LocalDateTime;

public class BloodRequest {
    private Integer id;
    private Integer requesterId;
    private String bloodGroup;
    private String city;
    private Double latitude;
    private Double longitude;
    private String message;
    private Integer donorId;
    private String donorName; // transient, from JOIN
    private String status; // OPEN, CLOSED, CANCELLED
    private LocalDateTime createdAt;

    public BloodRequest() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getRequesterId() { return requesterId; }
    public void setRequesterId(Integer requesterId) { this.requesterId = requesterId; }

    public Integer getDonorId() { return donorId; }
    public void setDonorId(Integer donorId) { this.donorId = donorId; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
}
