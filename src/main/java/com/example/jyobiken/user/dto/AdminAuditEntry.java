package com.example.jyobiken.user.dto;

import java.time.LocalDateTime;

public record AdminAuditEntry(
        Long id,
        String actorEmail,
        String action,
        String targetType,
        Long targetId,
        String details,
        LocalDateTime createdAt) {
}
