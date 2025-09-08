package com.capstone.pm.service;

import com.capstone.pm.entity.User;
import com.capstone.pm.repository.UserRepository;
import com.capstone.pm.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwt;

    public AuthService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtTokenProvider jwt) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
    }

    public Map<String, Object> login(String email, String rawPassword) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String role = user.getRole().name(); // enum이면 .name(), 문자열이면 그대로
        String token = jwt.generateAccessToken(user.getEmail(), Map.of("role", role));
        return Map.of("token", token, "role", role, "email", user.getEmail());
    }

    public Map<String, Object> me(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return Map.of("email", user.getEmail(), "displayName", user.getDisplayName(), "role", user.getRole().name());
    }

    public User register(String email, String displayName, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(email, displayName, encodedPassword, User.Role.TEAM_MEMBER);
        
        return userRepository.save(user);
    }
}