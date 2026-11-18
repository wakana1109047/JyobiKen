package com.example.jyobiken.user.dto;

import java.time.LocalDate;

import com.example.jyobiken.user.entity.StudentStage;
import com.example.jyobiken.user.entity.UserRole;
import jakarta.validation.constraints.NotNull;

import com.example.jyobiken.user.entity.AccountStatus;

public record UserAccessUpdateRequest(
        StudentStage studentStage,
        @NotNull(message = "権限は必須です") UserRole userRole,
        @NotNull(message = "アカウント状態は必須です") AccountStatus accountStatus,
        LocalDate expiresAt) {
}
