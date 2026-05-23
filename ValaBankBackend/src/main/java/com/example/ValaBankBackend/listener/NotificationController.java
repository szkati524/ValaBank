package com.example.ValaBankBackend.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/client/{clientId}")
    public List<Notification> getNotifications(@PathVariable Long clientId){
        return notificationRepository.findByClientIdOrderByCreatedAtDesc(clientId);


    }
}
