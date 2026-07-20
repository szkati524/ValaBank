package com.example.ValaBankBackend.service;

import com.example.ValaBankBackend.entity.User;
import com.example.ValaBankBackend.enums.Role;
import com.example.ValaBankBackend.listener.UserCreatedEvent;
import com.example.ValaBankBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final PasswordEncoder passwordEncoder;

    private String generateRandomLogin(){
        StringBuilder sb = new StringBuilder(10);
        for (int i = 0; i <10; i++){
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));

        }
        return sb.toString();
    }
    public User registerNewEmployee(String email,Role role){
        return createBaseUser(email,role);
    }
    public User createUserForClient(String email){
        return createBaseUser(email,Role.CLIENT);
    }
private User createBaseUser(String email,Role role){
        String generatedLogin = generateRandomLogin();
        User user = new User();
        user.setUsername(generatedLogin);
        user.setEmail(email);
        user.setRole(role);
        user.setPassword("");
        user.setFirstLogin(true);
        User savedUser = userRepository.save(user);
        applicationEventPublisher.publishEvent(new UserCreatedEvent(email,generatedLogin));
        return savedUser;
}
public User verifyFirstLogin(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o podanym loginie"));

        if (!user.isFirstLogin()){
            throw new RuntimeException("Konto zostało już wcześniej aktywowane");

        }
        return user;
}
public void activateAccount(String username,String newPassword){
        User user = verifyFirstLogin(username);
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFirstLogin(false);
        userRepository.save(user);
}



}
