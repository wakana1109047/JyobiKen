package com.example.jyobiken.user.dto;

import com.example.jyobiken.user.entity.StudentStage;
import com.example.jyobiken.user.entity.UserRole;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UserCreateRequest(
        @NotBlank(message = "名前は必須です")
        @Size(max = 50, message = "名前は50文字以内で入力してください")
        String name,

        @NotBlank(message = "メールアドレスは必須です")
        @Email(message = "正しいメールアドレスを入力してください")
        String email,

        @NotBlank(message = "パスワードは必須です")
        @Size(min = 8, message = "パスワードは8文字以上で入力してください")
        // 文字種類指定
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*[0-9]).*$",
                message = "パスワードには英字と数字を両方含めてください")
        String password,

        StudentStage studentStage,

        @NotNull(message = "権限は必須です")
        UserRole role,

        @Size(max = 50, message = "学科は50文字以内で入力してください")
        String department,

        Integer schoolYear,
        Integer graduationYear,
        LocalDate expiresAt
        ){
}
