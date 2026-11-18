package com.example.jyobiken.user.mapper;

import java.util.Locale;

import com.example.jyobiken.user.entity.*;
import org.springframework.stereotype.Component;

import com.example.jyobiken.user.dto.UserCreateRequest;
import com.example.jyobiken.user.dto.UserResponse;
import com.example.jyobiken.user.dto.UserUpdateRequest;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getStudentStage(),
                user.getRole(),
                user.getEffectiveAccountStatus(),
                user.getExpiresAt(),
                user.getDepartment(),
                user.getSchoolYear(),
                user.getGraduationYear());
    }

    public User toEntity(UserCreateRequest request, String encodedPassword) {
        return User.builder()
                .name(request.name().trim())
                .email(normalizeEmail(request.email()))
                .passwordHash(encodedPassword)
                .studentStage(request.studentStage())
                .role(request.role())
                .department(request.department().trim())
                .schoolYear(request.schoolYear())
                .graduationYear(request.graduationYear())
                .expiresAt(request.expiresAt())
                .accountStatus(AccountStatus.ACTIVE)
                .build();
    }

    public void updateEntity(User user, UserUpdateRequest request) {
        user.setName(request.name().trim());
        user.setEmail(normalizeEmail(request.email()));
    }

    public String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
