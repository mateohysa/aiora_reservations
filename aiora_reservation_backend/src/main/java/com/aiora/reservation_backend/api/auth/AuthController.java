package com.aiora.reservation_backend.api.auth;

import com.aiora.reservation_backend.api.model.LoginBody;
import com.aiora.reservation_backend.api.model.RegistrationBody;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginBody loginBody, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(loginBody);
        
        // Set JWT as a secure cookie
        Cookie cookie = new Cookie("jwt", authResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Enable in production with HTTPS
        cookie.setMaxAge(24 * 60 * 60); // 24 hours
        cookie.setPath("/");
        response.addCookie(cookie);
        
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegistrationBody registrationBody, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(registrationBody);
        
        // Set JWT as a secure cookie
        Cookie cookie = new Cookie("jwt", authResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Enable in production with HTTPS
        cookie.setMaxAge(24 * 60 * 60); // 24 hours
        cookie.setPath("/");
        response.addCookie(cookie);
        
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear the JWT cookie
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(0); // Expire immediately
        cookie.setPath("/");
        response.addCookie(cookie);
        
        return ResponseEntity.ok().build();
    }
}