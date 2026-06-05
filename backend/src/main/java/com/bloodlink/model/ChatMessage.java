package com.bloodlink.model;

import java.time.LocalDateTime;

public class ChatMessage {
    private Integer id;
    private Integer fromUserId;
    private Integer toUserId;
    private String text;
    private boolean isRead;
    private LocalDateTime createdAt;

    // Transient fields for API response
    private String fromUserName;
    private String toUserName;

    public ChatMessage() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getFromUserId() { return fromUserId; }
    public void setFromUserId(Integer fromUserId) { this.fromUserId = fromUserId; }

    public Integer getToUserId() { return toUserId; }
    public void setToUserId(Integer toUserId) { this.toUserId = toUserId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getFromUserName() { return fromUserName; }
    public void setFromUserName(String fromUserName) { this.fromUserName = fromUserName; }

    public String getToUserName() { return toUserName; }
    public void setToUserName(String toUserName) { this.toUserName = toUserName; }
}
