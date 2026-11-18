package com.example.jyobiken.user.entity;

import java.time.LocalDateTime;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String name;
    private String email;
    private String passwordHash;
    private LocalDateTime createdAt;
    private AccountStatus accountStatus;
    private LocalDate expiresAt;
    private String recoveryEmail;
    private StudentStage studentStage;
    private UserRole role;
    private String department;
    private Integer schoolYear;
    private Integer graduationYear;

    public AccountStatus getEffectiveAccountStatus() {
        if (accountStatus == AccountStatus.SUSPENDED || accountStatus == AccountStatus.EXPIRED) {
            return accountStatus;
        }

        return studentStage == StudentStage.GRADUATED && expiresAt != null && expiresAt.isBefore(LocalDate.now())
                ? AccountStatus.EXPIRED : AccountStatus.ACTIVE;
    }
}
