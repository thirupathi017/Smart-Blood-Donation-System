package com.bloodlink.dto;

import com.bloodlink.model.Role;
import java.time.LocalDate;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private Integer age;
    private Role role;
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    // Donor specific
    private String bloodGroup;
    private String city;
    private Double latitude;
    private Double longitude;
    private LocalDate lastDonationDate;
    private Integer weight;
    private Boolean feelingHealthy;
    private Boolean recentSurgeryTattoo;

    public RegisterRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
    
    public Integer getWeight() { return weight; }
    public void setWeight(Integer weight) { this.weight = weight; }
    
    public Boolean getFeelingHealthy() { return feelingHealthy; }
    public void setFeelingHealthy(Boolean feelingHealthy) { this.feelingHealthy = feelingHealthy; }
    
    public Boolean getRecentSurgeryTattoo() { return recentSurgeryTattoo; }
    public void setRecentSurgeryTattoo(Boolean recentSurgeryTattoo) { this.recentSurgeryTattoo = recentSurgeryTattoo; }
}
