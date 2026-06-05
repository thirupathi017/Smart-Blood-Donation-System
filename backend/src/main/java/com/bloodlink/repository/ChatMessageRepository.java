package com.bloodlink.repository;

import com.bloodlink.model.ChatMessage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChatMessageRepository {
    private final JdbcTemplate jdbcTemplate;

    public ChatMessageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ChatMessage> rowMapper = (rs, rowNum) -> {
        ChatMessage msg = new ChatMessage();
        msg.setId(rs.getInt("id"));
        msg.setFromUserId(rs.getInt("from_user_id"));
        msg.setToUserId(rs.getInt("to_user_id"));
        msg.setText(rs.getString("text"));
        msg.setRead(rs.getBoolean("is_read"));
        msg.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return msg;
    };

    private final RowMapper<ChatMessage> rowMapperWithNames = (rs, rowNum) -> {
        ChatMessage msg = new ChatMessage();
        msg.setId(rs.getInt("id"));
        msg.setFromUserId(rs.getInt("from_user_id"));
        msg.setToUserId(rs.getInt("to_user_id"));
        msg.setText(rs.getString("text"));
        msg.setRead(rs.getBoolean("is_read"));
        msg.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        msg.setFromUserName(rs.getString("from_name"));
        msg.setToUserName(rs.getString("to_name"));
        return msg;
    };

    public void save(ChatMessage message) {
        String sql = "INSERT INTO chat_messages (from_user_id, to_user_id, text) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, message.getFromUserId(), message.getToUserId(), message.getText());
    }

    /**
     * Get all messages between two users (conversation history), ordered by time
     */
    public List<ChatMessage> findConversation(int userId1, int userId2) {
        String sql = "SELECT cm.*, " +
                     "u1.name as from_name, u2.name as to_name " +
                     "FROM chat_messages cm " +
                     "JOIN users u1 ON cm.from_user_id = u1.id " +
                     "JOIN users u2 ON cm.to_user_id = u2.id " +
                     "WHERE (cm.from_user_id = ? AND cm.to_user_id = ?) " +
                     "OR (cm.from_user_id = ? AND cm.to_user_id = ?) " +
                     "ORDER BY cm.created_at ASC";
        return jdbcTemplate.query(sql, rowMapperWithNames, userId1, userId2, userId2, userId1);
    }

    /**
     * Get unread messages for a user (messages they haven't seen yet)
     */
    public List<ChatMessage> findUnreadForUser(int userId) {
        String sql = "SELECT cm.*, " +
                     "u1.name as from_name, u2.name as to_name " +
                     "FROM chat_messages cm " +
                     "JOIN users u1 ON cm.from_user_id = u1.id " +
                     "JOIN users u2 ON cm.to_user_id = u2.id " +
                     "WHERE cm.to_user_id = ? AND cm.is_read = FALSE " +
                     "ORDER BY cm.created_at DESC";
        return jdbcTemplate.query(sql, rowMapperWithNames, userId);
    }

    /**
     * Mark all messages from a specific sender to a user as read
     */
    public void markAsRead(int toUserId, int fromUserId) {
        String sql = "UPDATE chat_messages SET is_read = TRUE WHERE to_user_id = ? AND from_user_id = ?";
        jdbcTemplate.update(sql, toUserId, fromUserId);
    }

    /**
     * Mark all messages to a user as read
     */
    public void markAllAsRead(int userId) {
        String sql = "UPDATE chat_messages SET is_read = TRUE WHERE to_user_id = ?";
        jdbcTemplate.update(sql, userId);
    }

    /**
     * Delete all messages between two users (clear chat for both sides)
     */
    public int deleteConversation(int userId1, int userId2) {
        String sql = "DELETE FROM chat_messages WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)";
        return jdbcTemplate.update(sql, userId1, userId2, userId2, userId1);
    }
}
