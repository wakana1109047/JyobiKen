package com.example.jyobiken.user.dto;

import java.time.LocalDateTime;
import java.time.LocalDate;

import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.UserType;

public record UserResponse(
        Long id,
        String name,
        String email,
        LocalDateTime createdAt,
        UserType userType,
        AccountStatus accountStatus,
        LocalDate expiresAt) {
}
