package com.example.jyobiken.user.mapper;

import java.util.Locale;

import org.springframework.stereotype.Component;

import com.example.jyobiken.user.dto.UserCreateRequest;
import com.example.jyobiken.user.dto.UserResponse;
import com.example.jyobiken.user.dto.UserUpdateRequest;
import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.AppUser;
import com.example.jyobiken.user.entity.UserType;

@Component
public class UserMapper {

    public UserResponse toResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUserType(),
                user.getEffectiveAccountStatus(),
                user.getExpiresAt());
    }

    public AppUser toEntity(UserCreateRequest request, String encodedPassword) {
        return AppUser.builder()
                .name(request.name().trim())
                .email(normalizeEmail(request.email()))
                .passwordHash(encodedPassword)
                .userType(request.userType() == null ? UserType.GENERAL_STUDENT : request.userType())
                .accountStatus(AccountStatus.ACTIVE)
                .build();
    }

    public void updateEntity(AppUser user, UserUpdateRequest request) {
        user.setName(request.name().trim());
        user.setEmail(normalizeEmail(request.email()));
    }

    public String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
