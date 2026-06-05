package com.bloodlink.repository;

import com.bloodlink.model.Notification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class NotificationRepository {
    private final JdbcTemplate jdbcTemplate;

    public NotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notification> rowMapper = (rs, rowNum) -> {
        Notification n = new Notification();
        n.setId(rs.getInt("id"));
        n.setUserId(rs.getInt("user_id"));
        n.setTitle(rs.getString("title"));
        n.setMessage(rs.getString("message"));
        n.setType(rs.getString("type"));
        int fromUserId = rs.getInt("from_user_id");
        n.setFromUserId(rs.wasNull() ? null : fromUserId);
        n.setRead(rs.getBoolean("is_read"));
        n.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return n;
    };

    private final RowMapper<Notification> rowMapperWithName = (rs, rowNum) -> {
        Notification n = new Notification();
        n.setId(rs.getInt("id"));
        n.setUserId(rs.getInt("user_id"));
        n.setTitle(rs.getString("title"));
        n.setMessage(rs.getString("message"));
        n.setType(rs.getString("type"));
        int fromUserId = rs.getInt("from_user_id");
        n.setFromUserId(rs.wasNull() ? null : fromUserId);
        n.setRead(rs.getBoolean("is_read"));
        n.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        n.setFromUserName(rs.getString("from_name"));
        return n;
    };

    public void save(Notification notification) {
        String sql = "INSERT INTO notifications (user_id, title, message, type, from_user_id) VALUES (?, ?, ?, ?, ?)";
        org.springframework.jdbc.support.KeyHolder keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            java.sql.PreparedStatement ps = connection.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, notification.getUserId());
            ps.setString(2, notification.getTitle());
            ps.setString(3, notification.getMessage());
            ps.setString(4, notification.getType());
            if (notification.getFromUserId() != null) {
                ps.setInt(5, notification.getFromUserId());
            } else {
                ps.setNull(5, java.sql.Types.INTEGER);
            }
            return ps;
        }, keyHolder);
        
        if (keyHolder.getKey() != null) {
            notification.setId(keyHolder.getKey().intValue());
        }
    }

    public List<Notification> findUnreadForUser(int userId) {
        String sql = "SELECT n.*, u.name as from_name FROM notifications n " +
                     "LEFT JOIN users u ON n.from_user_id = u.id " +
                     "WHERE n.user_id = ? AND n.is_read = FALSE " +
                     "ORDER BY n.created_at DESC LIMIT 50";
        return jdbcTemplate.query(sql, rowMapperWithName, userId);
    }

    public void markAsRead(int notificationId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE id = ?";
        jdbcTemplate.update(sql, notificationId);
    }

    public void markAllAsReadForUser(int userId) {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }
}
