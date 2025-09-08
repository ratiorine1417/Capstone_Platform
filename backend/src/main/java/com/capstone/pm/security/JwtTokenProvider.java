package com.capstone.pm.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessExpMinutes;
    private final String issuer;
    private final ObjectMapper om = new ObjectMapper();

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secretBase64,
            @Value("${app.jwt.access-exp-minutes}") long accessExpMinutes,
            @Value("${app.jwt.issuer}") String issuer
    ) {
        // Base64 문자열로부터 키를 복원 (jjwt 0.12.x는 Keys.hmacShaKeyFor(byte[]) 사용)
        this.key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secretBase64));
        this.accessExpMinutes = accessExpMinutes;
        this.issuer = issuer;
    }

    public String generateAccessToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessExpMinutes * 60);
        return Jwts.builder()
                .subject(subject)
                .issuer(issuer)
                .claims(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)
                .compact();
    }

    public boolean validate(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getSubject(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public Claims getAllClaims(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
    }

    public String getRole(String token) {
        Object role = getAllClaims(token).get("role");
        return role == null ? null : role.toString();
    }
}