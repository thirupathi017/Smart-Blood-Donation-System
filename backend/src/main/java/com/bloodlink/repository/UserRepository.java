package com.bloodlink.repository;

import com.bloodlink.model.Role;
import com.bloodlink.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setPhone(rs.getString("phone"));
        user.setAge(rs.getInt("age"));
        user.setRole(Role.valueOf(rs.getString("role")));
        user.setVerified(rs.getBoolean("is_verified"));
        user.setActive(rs.getBoolean("is_active"));
        user.setReputationScore(rs.getInt("reputation_score"));
        user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return user;
    };

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        return jdbcTemplate.query(sql, userRowMapper, email).stream().findFirst();
    }

    public Optional<User> findById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        return jdbcTemplate.query(sql, userRowMapper, id).stream().findFirst();
    }

    public int save(User user) {
        String sql = "INSERT INTO users (name, email, password, phone, age, role, is_verified, is_active, reputation_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, user.getName(), user.getEmail(), user.getPassword(), 
                user.getPhone(), user.getAge(), user.getRole().name(), 
                user.isVerified(), user.isActive(), user.getReputationScore());
    }

    public java.util.List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    public java.util.List<User> findAllNonAdmins() {
        String sql = "SELECT * FROM users WHERE role != 'ADMIN' ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    public int updateStatus(int id, boolean isActive) {
        String sql = "UPDATE users SET is_active = ? WHERE id = ?";
        return jdbcTemplate.update(sql, isActive, id);
    }

    public int updateVerification(int id, boolean isVerified) {
        String sql = "UPDATE users SET is_verified = ? WHERE id = ?";
        return jdbcTemplate.update(sql, isVerified, id);
    }

    public java.util.Map<String, Object> getStats() {
        String sql = "SELECT " +
                     "(SELECT COUNT(*) FROM users) as total_users, " +
                     "(SELECT COUNT(*) FROM users WHERE role = 'DONOR') as total_donors, " +
                     "(SELECT COUNT(*) FROM blood_requests) as total_requests, " +
                     "(SELECT COUNT(*) FROM donations) as total_donations";
        return jdbcTemplate.queryForMap(sql);
    }

    public int deleteById(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
