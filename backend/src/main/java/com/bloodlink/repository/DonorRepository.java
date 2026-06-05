package com.bloodlink.repository;

import com.bloodlink.model.DonorProfile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DonorRepository {
    private final JdbcTemplate jdbcTemplate;

    public DonorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DonorProfile> donorRowMapper = (rs, rowNum) -> {
        DonorProfile profile = new DonorProfile();
        profile.setId(rs.getInt("id"));
        profile.setUserId(rs.getInt("user_id"));
        profile.setBloodGroup(rs.getString("blood_group"));
        profile.setCity(rs.getString("city"));
        profile.setLatitude(rs.getDouble("latitude"));
        profile.setLongitude(rs.getDouble("longitude"));
        profile.setAvailability(rs.getBoolean("availability"));
        if (rs.getDate("last_donation_date") != null) {
            profile.setLastDonationDate(rs.getDate("last_donation_date").toLocalDate());
        }
        profile.setWeight(rs.getInt("weight"));
        profile.setFeelingHealthy(rs.getBoolean("feeling_healthy"));
        profile.setRecentSurgeryTattoo(rs.getBoolean("recent_surgery_tattoo"));
        profile.setPreferredDistance(rs.getInt("preferred_distance"));
        profile.setNotificationsEnabled(rs.getBoolean("notifications_enabled"));
        profile.setTotalDonations(rs.getInt("total_donations"));
        profile.setLivesImpacted(rs.getInt("lives_impacted"));
        profile.setRating(rs.getDouble("rating"));
        return profile;
    };

    public int save(DonorProfile profile) {
        String sql = "INSERT INTO donor_profiles (user_id, blood_group, city, latitude, longitude, availability, last_donation_date, weight, feeling_healthy, recent_surgery_tattoo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, 
            profile.getUserId(), 
            profile.getBloodGroup(), 
            profile.getCity(), 
            profile.getLatitude(), 
            profile.getLongitude(), 
            profile.getAvailability(), 
            profile.getLastDonationDate(),
            profile.getWeight(),
            profile.getFeelingHealthy(),
            profile.getRecentSurgeryTattoo()
        );
    }

    public List<DonorProfile> findByBloodGroup(String bloodGroup) {
        String sql = "SELECT * FROM donor_profiles WHERE blood_group = ? AND availability = TRUE AND (last_donation_date IS NULL OR DATEDIFF(CURRENT_DATE, last_donation_date) >= 90)";
        return jdbcTemplate.query(sql, donorRowMapper, bloodGroup);
    }

    public List<DonorProfile> findAllAvailable() {
        String sql = "SELECT * FROM donor_profiles WHERE availability = TRUE AND (last_donation_date IS NULL OR DATEDIFF(CURRENT_DATE, last_donation_date) >= 90)";
        return jdbcTemplate.query(sql, donorRowMapper);
    }

    public DonorProfile findByUserId(int userId) {
        String sql = "SELECT * FROM donor_profiles WHERE user_id = ?";
        List<DonorProfile> profiles = jdbcTemplate.query(sql, donorRowMapper, userId);
        return profiles.isEmpty() ? null : profiles.get(0);
    }

    public int updateAvailability(int userId, boolean availability) {
        String sql = "UPDATE donor_profiles SET availability = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql, availability, userId);
    }

    public int updateProfile(int userId, boolean feelingHealthy, boolean recentSurgeryTattoo, int preferredDistance, boolean notificationsEnabled) {
        String sql = "UPDATE donor_profiles SET feeling_healthy = ?, recent_surgery_tattoo = ?, preferred_distance = ?, notifications_enabled = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql, feelingHealthy, recentSurgeryTattoo, preferredDistance, notificationsEnabled, userId);
    }

    public int recordDonation(int userId) {
        String sql = "UPDATE donor_profiles SET total_donations = total_donations + 1, lives_impacted = lives_impacted + 3, last_donation_date = CURRENT_DATE, availability = FALSE WHERE user_id = ?";
        return jdbcTemplate.update(sql, userId);
    }
}
