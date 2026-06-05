package com.bloodlink.controller;

import com.bloodlink.model.ChatMessage;
import com.bloodlink.model.Notification;
import com.bloodlink.repository.ChatMessageRepository;
import com.bloodlink.repository.NotificationRepository;
import com.bloodlink.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@ResponseBody
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationRepository notificationRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate,
                          UserRepository userRepository,
                          ChatMessageRepository chatMessageRepository,
                          NotificationRepository notificationRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.notificationRepository = notificationRepository;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> payload) {
        int fromUserId = Integer.parseInt(payload.get("fromUserId").toString());
        int toUserId = Integer.parseInt(payload.get("toUserId").toString());
        String text = payload.get("text").toString();
        String fromUserName = payload.getOrDefault("fromUserName", "Unknown").toString();

        // 1. Save to database so messages persist
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setFromUserId(fromUserId);
        chatMessage.setToUserId(toUserId);
        chatMessage.setText(text);
        chatMessageRepository.save(chatMessage);

        // 2. Save a notification for the receiver in the database
        Notification notification = new Notification();
        notification.setUserId(toUserId);
        notification.setTitle("Message from " + fromUserName);
        notification.setMessage(text);
        notification.setType("MESSAGE");
        notification.setFromUserId(fromUserId);
        notificationRepository.save(notification);

        // 3. Build a clean message payload with explicit sender/receiver IDs
        Map<String, Object> messagePayload = new HashMap<>();
        messagePayload.put("fromUserId", fromUserId);
        messagePayload.put("toUserId", toUserId);
        messagePayload.put("fromUserName", fromUserName);
        messagePayload.put("text", text);
        messagePayload.put("timestamp", new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").format(new java.util.Date()));

        // 4. Send via WebSocket to receiver ONLY (real-time delivery if they're online)
        userRepository.findById(toUserId).ifPresent(user -> {
            // Send the clean message to the chat window
            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/messages",
                    messagePayload
            );
            
            // Send the notification to the notification bell
            Map<String, Object> notifPayload = new HashMap<>();
            notifPayload.put("id", notification.getId());
            notifPayload.put("title", "Message from " + fromUserName);
            notifPayload.put("message", text);
            notifPayload.put("type", "MESSAGE");
            notifPayload.put("fromUserId", fromUserId);
            notifPayload.put("fromUserName", fromUserName);
            notifPayload.put("timestamp", System.currentTimeMillis());
            
            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/notifications",
                    notifPayload
            );
        });
    }

    // REST endpoint: Get conversation history between two users
    @GetMapping("/api/chat/history/{otherUserId}")
    public ResponseEntity<List<Map<String, Object>>> getChatHistory(
            @PathVariable int otherUserId,
            @RequestParam int userId) {

        List<ChatMessage> messages = chatMessageRepository.findConversation(userId, otherUserId);

        List<Map<String, Object>> result = messages.stream().map(msg -> {
            Map<String, Object> m = new HashMap<>();
            m.put("fromUserId", msg.getFromUserId());
            m.put("toUserId", msg.getToUserId());
            m.put("fromUserName", msg.getFromUserName());
            m.put("text", msg.getText());
            m.put("timestamp", msg.getCreatedAt().toString());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // REST endpoint: Get unread notifications for a user
    @GetMapping("/api/notifications/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getNotifications(@PathVariable int userId) {
        List<Notification> notifications = notificationRepository.findUnreadForUser(userId);

        List<Map<String, Object>> result = notifications.stream().map(n -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", n.getId());
            m.put("title", n.getTitle());
            m.put("message", n.getMessage());
            m.put("type", n.getType());
            m.put("fromUserId", n.getFromUserId());
            m.put("fromUserName", n.getFromUserName());
            m.put("timestamp", n.getCreatedAt().toString());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // REST endpoint: Mark a notification as read
    @PutMapping("/api/notifications/{notificationId}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable int notificationId) {
        notificationRepository.markAsRead(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    // REST endpoint: Mark all notifications as read for a user
    @PutMapping("/api/notifications/{userId}/read-all")
    public ResponseEntity<?> markAllRead(@PathVariable int userId) {
        notificationRepository.markAllAsReadForUser(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // REST endpoint: Mark messages from a specific user as read
    @PutMapping("/api/chat/read/{fromUserId}")
    public ResponseEntity<?> markMessagesRead(
            @PathVariable int fromUserId,
            @RequestParam int userId) {
        chatMessageRepository.markAsRead(userId, fromUserId);
        return ResponseEntity.ok(Map.of("message", "Messages marked as read"));
    }

    // REST endpoint: Clear all messages in a conversation between two users
    @DeleteMapping("/api/chat/clear/{otherUserId}")
    public ResponseEntity<?> clearConversation(
            @PathVariable int otherUserId,
            @RequestParam int userId) {
        int deleted = chatMessageRepository.deleteConversation(userId, otherUserId);
        return ResponseEntity.ok(Map.of("message", "Chat cleared", "deleted", deleted));
    }
}
