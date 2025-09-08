package com.capstone.pm.util;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordHashTest {
    @Test
    void generatePasswordHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("password");
        System.out.println("BCrypt hash for 'password': " + hash);
        
        // 기존 해시 검증
        String existingHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.";
        boolean matches = encoder.matches("password", existingHash);
        System.out.println("Existing hash matches 'password': " + matches);
    }
}