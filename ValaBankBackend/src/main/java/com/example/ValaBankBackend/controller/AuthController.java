package com.example.ValaBankBackend.controller;


import com.example.ValaBankBackend.dto.LoginRequest;
import com.example.ValaBankBackend.dto.UserMeResponse;
import com.example.ValaBankBackend.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;


    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(),
                        loginRequest.password()
                        )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return ResponseEntity.ok("Zalogowano pomyślnie w systemie ValaBank!");
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMe(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")){
            return ResponseEntity.status(401).body("Użytkownik zalogowany");
        }
        User user = (User)  auth.getPrincipal();
        return ResponseEntity.ok(new UserMeResponse(user.getId(),user.getUsername(),user.getRole().name()));
    }
}
