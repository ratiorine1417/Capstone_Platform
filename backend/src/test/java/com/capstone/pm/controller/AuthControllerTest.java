package com.capstone.pm.controller;

import com.capstone.pm.config.JpaAuditingConfig;
import com.capstone.pm.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// ★ Auditing 설정 제외
@WebMvcTest(
        controllers = AuthController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JpaAuditingConfig.class
        )
)
@AutoConfigureMockMvc(addFilters = false) // ★ 보안 필터 비활성화(필요 시 true로 바꾸고 필요한 빈 추가)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    // === 실제 의존성 타입에 맞게 추가 ===
    @MockBean private AuthService authService;
    // @MockBean private com.capstone.pm.security.JwtProvider jwtProvider;
    // @MockBean private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("로그인 성공 테스트")
    void 로그인_성공_테스트() throws Exception {
        Map<String, Object> mockResult = Map.of(
            "token", "dummy-jwt-token-1",
            "user", Map.of(
                "id", 1L,
                "email", "admin@taskloom.com",
                "displayName", "시스템 관리자",
                "role", "ADMIN"
            )
        );

        when(authService.login(anyString(), anyString())).thenReturn(mockResult);

        AuthController.LoginRequest loginRequest = new AuthController.LoginRequest();
        loginRequest.setEmail("admin@taskloom.com");
        loginRequest.setPassword("password");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("SUCCESS"))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.user.email").value("admin@taskloom.com"));
    }

    @Test
    @DisplayName("로그인 유효성검사 실패 테스트")
    void 로그인_유효성검사_실패_테스트() throws Exception {
        AuthController.LoginRequest loginRequest = new AuthController.LoginRequest();
        loginRequest.setEmail("invalid-email");
        loginRequest.setPassword("");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }
}