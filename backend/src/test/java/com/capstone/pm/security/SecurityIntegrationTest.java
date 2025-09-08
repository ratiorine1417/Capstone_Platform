package com.capstone.pm.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.Map;
import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    JwtTokenProvider provider;

    private String bearer(String email, String role) {
        String token = provider.generateAccessToken(email, Map.of("role", role));
        return "Bearer " + token;
    }

    @Test
    void 인증없으면_401() throws Exception {
        mockMvc.perform(get("/api/secure/ping"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void 토큰있으면_200() throws Exception {
        mockMvc.perform(get("/api/secure/ping")
                .header("Authorization", bearer("user@example.com", "TEAM_LEAD")))
                .andExpect(status().isOk())
                .andExpect(content().string("pong"));
    }

    @Test
    void ADMIN_엔드포인트_권한없으면_403() throws Exception {
        mockMvc.perform(get("/admin/ping")
                .header("Authorization", bearer("user@example.com", "TEAM_LEAD")))
                .andExpect(status().isForbidden());
    }

    @Test
    void ADMIN_엔드포인트_ADMIN이면_200() throws Exception {
        mockMvc.perform(get("/admin/ping")
                .header("Authorization", bearer("admin@taskloom.com", "ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().string("admin-pong"));
    }
}