package com.example.jyobiken.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jyobiken.user.dto.AdminAuditEntry;
import com.example.jyobiken.user.repository.AdminAuditRepository;

@RestController
@RequestMapping("/api/admin/audit")
public class AdminAuditController {

    private final AdminAuditRepository adminAuditRepository;

    public AdminAuditController(AdminAuditRepository adminAuditRepository) {
        this.adminAuditRepository = adminAuditRepository;
    }

    @GetMapping
    public List<AdminAuditEntry> getAuditLog() {
        return adminAuditRepository.findAll();
    }
}
