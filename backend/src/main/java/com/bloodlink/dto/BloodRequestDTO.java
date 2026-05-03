package com.bloodlink.dto;

import com.bloodlink.model.BloodRequest;
import com.bloodlink.model.User;
import java.time.LocalDateTime;

public class BloodRequestDTO {
    private Integer id;
    private Integer requesterId;
    private String requesterName;
    private String bloodGroup;
    private String city;
    private Double latitude;
    private Double longitude;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public BloodRequestDTO() {}

    public BloodRequestDTO(BloodRequest request, User requester) {
        this.id = request.getId();
        this.requesterId = request.getRequesterId();
        this.requesterName = requester != null ? requester.getName() : "Unknown";
        this.bloodGroup = request.getBloodGroup();
        this.city = request.getCity();
        this.latitude = request.getLatitude();
        this.longitude = request.getLongitude();
        this.message = request.getMessage();
        this.status = request.getStatus();
        this.createdAt = request.getCreatedAt();
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getRequesterId() { return requesterId; }
    public void setRequesterId(Integer requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

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
}
