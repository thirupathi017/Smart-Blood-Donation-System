package com.bloodlink.service;

import com.bloodlink.model.Notification;
import com.bloodlink.repository.NotificationRepository;
import com.bloodlink.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public NotificationService(SimpMessagingTemplate messagingTemplate,
                               UserRepository userRepository,
                               NotificationRepository notificationRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(int userId, String title, String message, String type) {
        // Persist the notification to the database
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);

        // Also send via WebSocket for real-time delivery
        userRepository.findById(userId).ifPresent(user -> {
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", notification.getId());
            payload.put("title", title);
            payload.put("message", message);
            payload.put("type", type);
            payload.put("timestamp", System.currentTimeMillis());

            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/notifications",
                    payload
            );
        });
    }
}
