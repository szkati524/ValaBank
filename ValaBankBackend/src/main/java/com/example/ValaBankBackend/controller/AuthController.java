package com.example.ValaBankBackend.controller;


import com.example.ValaBankBackend.dto.ActivateAccountRequest;
import com.example.ValaBankBackend.dto.JwtResponse;
import com.example.ValaBankBackend.dto.LoginRequest;
import com.example.ValaBankBackend.dto.UserMeResponse;
import com.example.ValaBankBackend.entity.User;
import com.example.ValaBankBackend.service.JwtService;
import com.example.ValaBankBackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;



    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(),
                        loginRequest.password()
                        )
        );
        User user = (User) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new JwtResponse(jwtToken));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMe(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")){
            return ResponseEntity.status(401).body("Użytkownik zalogowany");
        }
        User user = (User)  auth.getPrincipal();
        String displayName = (user.getClient() != null)
                ? user.getClient().getName() + " " + user.getClient().getSurname()
                : "Pracownik Systemu";
        return ResponseEntity.ok(new UserMeResponse(user.getId(),user.getUsername(),user.getRole().name(),displayName));
    }
    @PostMapping("/first-login/verify")
    public ResponseEntity<?> verifyFirstLogin(@RequestParam String username){
        try{
            userService.verifyFirstLogin(username);
            return ResponseEntity.ok().body("Login prawidłowy, konto gotowe do aktywacji");
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }
    @PostMapping("/first-login/activate")
    public ResponseEntity<?> activateAccount(@RequestBody ActivateAccountRequest request){
        try{
            userService.activateAccount(request.username(),request.password());
            return ResponseEntity.ok().body("Konto zostało pomyślnie aktywowane. Możesz się zalogować.");
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
