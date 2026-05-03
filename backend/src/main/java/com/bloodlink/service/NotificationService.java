package com.bloodlink.service;

import com.bloodlink.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public NotificationService(SimpMessagingTemplate messagingTemplate, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    public void sendNotification(int userId, String title, String message, String type) {
        userRepository.findById(userId).ifPresent(user -> {
            Map<String, Object> notification = new HashMap<>();
            notification.put("title", title);
            notification.put("message", message);
            notification.put("type", type);
            notification.put("timestamp", System.currentTimeMillis());

            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/notifications",
                    notification
            );
        });
    }

    public void broadcastEmergency(String bloodGroup, String city, String message, Integer senderId) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("bloodGroup", bloodGroup);
        alert.put("city", city);
        alert.put("message", message);
        alert.put("senderId", senderId);
        alert.put("type", "EMERGENCY");

        messagingTemplate.convertAndSend("/topic/emergency", alert);
    }
}
