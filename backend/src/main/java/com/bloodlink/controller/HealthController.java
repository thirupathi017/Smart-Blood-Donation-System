package com.bloodlink.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/health")
    public String health() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return "Backend is running and Database is connected!";
        } catch (Exception e) {
            return "Backend is running, but Database connection failed: " + e.getMessage();
        }
    }
}
