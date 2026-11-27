package com.example.jyobiken.user.dto;

import java.time.LocalDateTime;
import java.time.LocalDate;

import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.StudentStage;
import com.example.jyobiken.user.entity.UserRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        LocalDateTime createdAt,
        StudentStage studentStage,
        UserRole role,
        AccountStatus accountStatus,
        LocalDate expiresAt,
        String department,
        Integer schoolYear,
        Integer graduationYear){
}
