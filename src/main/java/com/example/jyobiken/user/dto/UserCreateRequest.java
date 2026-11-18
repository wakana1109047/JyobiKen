package com.example.jyobiken.user.dto;

import com.example.jyobiken.user.entity.StudentStage;
import com.example.jyobiken.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserCreateRequest(
        @NotBlank(message = "名前は必須です")
        @Size(max = 50, message = "名前は50文字以内で入力してください")
        String name,

        @NotBlank(message = "メールアドレスは必須です")
        @Email(message = "正しいメールアドレスを入力してください")
        String email,

        @NotBlank(message = "パスワードは必須です")
        @Size(min = 12, message = "パスワードは12文字以上で入力してください")
        String password,

        StudentStage studentStage,

        @NotNull(message = "権限は必須です")
        UserRole role,

        @NotBlank(message = "学科は必須です")
        @Size(max = 50, message = "学科は50文字以内で入力してください")
        String department,

        Integer schoolYear,
        Integer graduationYear,
        LocalDate expiresAt
        ){
}
