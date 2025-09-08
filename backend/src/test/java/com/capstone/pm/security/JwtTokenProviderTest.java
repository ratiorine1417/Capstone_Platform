package com.capstone.pm.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    @Test
    void 토큰_생성_및_검증() {
        String secret = Base64.getEncoder().encodeToString("local_dev_secret_please_change_me_________".getBytes());
        JwtTokenProvider provider = new JwtTokenProvider(secret, 5, "taskloom");

        String token = provider.generateAccessToken("user@example.com", Map.of("role", "USER"));
        assertThat(token).isNotBlank();
        assertThat(provider.validate(token)).isTrue();
        assertThat(provider.getSubject(token)).isEqualTo("user@example.com");
    }
}