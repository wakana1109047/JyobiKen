package com.example.jyobiken.user.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.UserType;

public record UserAccessUpdateRequest(
        @NotNull(message = "利用者区分は必須です") UserType userType,
        @NotNull(message = "アカウント状態は必須です") AccountStatus accountStatus,
        LocalDate expiresAt) {
}
