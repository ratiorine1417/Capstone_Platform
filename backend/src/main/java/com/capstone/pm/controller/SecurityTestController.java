package com.capstone.pm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class SecurityTestController {

    @GetMapping("/api/secure/ping")
    public ResponseEntity<String> securePing() {
        return ResponseEntity.ok("pong");
    }

    @GetMapping("/admin/ping")
    public ResponseEntity<String> adminPing() {
        return ResponseEntity.ok("admin-pong");
    }
}