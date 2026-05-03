package com.bloodlink.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final com.bloodlink.repository.UserRepository userRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, com.bloodlink.repository.UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> payload) {
        int toUserId = Integer.parseInt(payload.get("toUserId").toString());
        
        userRepository.findById(toUserId).ifPresent(user -> {
            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/messages",
                    payload
            );
        });
    }
}
