package com.capstone.pm.security;

import com.capstone.pm.controller.AuthController;
import com.capstone.pm.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthApiIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired JwtTokenProvider provider;

    @Test
    void 로그인_성공_then_토큰발급() throws Exception {
        // data.sql의 admin@taskloom.com / "password" (bcrypt) 사용
        String body = """
          { "email":"admin@taskloom.com", "password":"password" }
        """;
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token", not(emptyString())))
            .andExpect(jsonPath("$.role", is("ADMIN")));
    }

    @Test
    void 로그인_실패_then_401() throws Exception {
        String body = """
          { "email":"admin@taskloom.com", "password":"wrong" }
        """;
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void me_토큰없으면_401() throws Exception {
        mockMvc.perform(get("/auth/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void me_토큰있으면_200_and_프로필반환() throws Exception {
        String token = provider.generateAccessToken("admin@taskloom.com",
                java.util.Map.of("role","ADMIN"));
        mockMvc.perform(get("/auth/me")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email", is("admin@taskloom.com")))
            .andExpect(jsonPath("$.role", is("ADMIN")));
    }
}