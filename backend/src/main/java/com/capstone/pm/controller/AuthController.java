package com.capstone.pm.controller;

import com.capstone.pm.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Map<String, Object> result = auth.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            // 401로 통일
            return ResponseEntity.status(401).body(Map.of("status", 401, "error", "Unauthorized", "message", "Invalid credentials"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body(Map.of("status", 401, "error", "Unauthorized", "message", "Authentication required"));
        }
        String email = (String) authentication.getPrincipal(); // JwtAuthenticationFilter에서 subject로 세팅
        try {
            return ResponseEntity.ok(auth.me(email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("status", 401, "error", "Unauthorized", "message", e.getMessage()));
        }
    }

    // 기존에 중첩 클래스로 이미 있으면 그대로 사용하고, 없으면 아래 DTO 사용
    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;
    }
}