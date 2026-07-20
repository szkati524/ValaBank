package com.example.ValaBankBackend.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Not;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    private final JavaMailSender javaMailSender;

    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        log.info("Zapisywanie powiadomienia dla klienta o ID: ", event.clientId());
        Notification notification = new Notification();
        notification.setClientId(event.clientId());
        notification.setMessage(event.message());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
    }
          @Async
        @EventListener
                public void handleUserCreatedMail(UserCreatedEvent event){
              log.info("Rozpoczęcie wysyłki e-maila powitalnego do: {}", event.email());
              try{
                  SimpleMailMessage message = new SimpleMailMessage();
                  message.setFrom("no-reply@valabank.com");
                  message.setText(event.email());
                  message.setSubject("Witamy w ValaBank! Twój login do konta");
                  message.setText(String.format(
                          "Witaj!\n\n" +
                                  "Twoje konto w ValaBank zostało pomyślnie utworzone.\n" +
                                  "Oto Twój wygenerowany login do systemu: %s\n\n" +
                                  "Użyj go podczas pierwszego logowania. Ze względów bezpieczeństwa rekomendujemy niezwłoczną zmianę hasła.\n\n" +
                                  "Pozdrawiamy,\nZespół ValaBank",
                          event.username()
                  ));
                  javaMailSender.send(message);
                  log.info("E-mail aktywacyjny wysłany pomyślnie na adres: {}", event.email());

        } catch (Exception e){
                  log.error("Nie udało się wysłać e-maila do {}: {}", event.email(), e.getMessage());
              }
    }
}
