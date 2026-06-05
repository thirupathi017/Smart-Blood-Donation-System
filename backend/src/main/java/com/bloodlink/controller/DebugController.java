package com.bloodlink.controller;

import com.bloodlink.repository.UserRepository;
import com.bloodlink.repository.DonorRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;

@RestController
public class DebugController {
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;

    public DebugController(UserRepository userRepository, DonorRepository donorRepository) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
    }

    @GetMapping("/api/debug/data")
    public Map<String, Object> getData() {
        return Map.of(
            "users", userRepository.findAll(),
            "donor_profiles", donorRepository.findAllAvailable()
        );
    }

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @org.springframework.web.bind.annotation.PostMapping("/api/debug/sql")
    public String runSql(@org.springframework.web.bind.annotation.RequestBody String sql) {
        jdbcTemplate.execute(sql);
        return "Executed successfully: " + sql;
    }
}
