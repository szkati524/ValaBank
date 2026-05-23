package com.example.ValaBankBackend.listener;

import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Not;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    @EventListener
    public void handleBankEvent(BankEvent event){
        Notification notification = new Notification();
        notification.setClientId(event.clientId());
        notification.setMessage(event.message());
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        //JavaMailSender here i will implement next time
    }
}
