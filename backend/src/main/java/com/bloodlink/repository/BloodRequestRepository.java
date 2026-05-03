package com.bloodlink.repository;

import com.bloodlink.model.BloodRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BloodRequestRepository {
    private final JdbcTemplate jdbcTemplate;

    public BloodRequestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<BloodRequest> requestRowMapper = (rs, rowNum) -> {
        BloodRequest request = new BloodRequest();
        request.setId(rs.getInt("id"));
        request.setRequesterId(rs.getInt("requester_id"));
        request.setBloodGroup(rs.getString("blood_group"));
        request.setCity(rs.getString("city"));
        request.setLatitude(rs.getDouble("latitude"));
        request.setLongitude(rs.getDouble("longitude"));
        request.setMessage(rs.getString("message"));
        request.setStatus(rs.getString("status"));
        request.setDonorId(rs.getObject("donor_id") != null ? rs.getInt("donor_id") : null);
        request.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return request;
    };

    private final RowMapper<com.bloodlink.dto.BloodRequestDTO> dtoRowMapper = (rs, rowNum) -> {
        com.bloodlink.dto.BloodRequestDTO dto = new com.bloodlink.dto.BloodRequestDTO();
        dto.setId(rs.getInt("id"));
        dto.setRequesterId(rs.getInt("requester_id"));
        dto.setRequesterName(rs.getString("requester_name"));
        dto.setBloodGroup(rs.getString("blood_group"));
        dto.setCity(rs.getString("city"));
        dto.setLatitude(rs.getDouble("latitude"));
        dto.setLongitude(rs.getDouble("longitude"));
        dto.setMessage(rs.getString("message"));
        dto.setStatus(rs.getString("status"));
        dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return dto;
    };

    public int save(BloodRequest request) {
        String sql = "INSERT INTO blood_requests (requester_id, blood_group, city, latitude, longitude, message, status, donor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, 
            request.getRequesterId(), 
            request.getBloodGroup(), 
            request.getCity(), 
            request.getLatitude(), 
            request.getLongitude(), 
            request.getMessage(),
            request.getStatus() != null ? request.getStatus() : "OPEN",
            request.getDonorId()
        );
    }

    public List<BloodRequest> findByRequesterId(Integer requesterId) {
        String sql = "SELECT * FROM blood_requests WHERE requester_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, requestRowMapper, requesterId);
    }

    public List<com.bloodlink.dto.BloodRequestDTO> findNearby(String bloodGroup, Double latitude, Double longitude, Double radiusInKm) {
        String sql = "SELECT br.*, u.name as requester_name FROM blood_requests br " +
                     "JOIN users u ON br.requester_id = u.id " +
                     "WHERE br.blood_group = ? AND br.status = 'OPEN' ORDER BY br.created_at DESC";
        return jdbcTemplate.query(sql, dtoRowMapper, bloodGroup);
    }
}
