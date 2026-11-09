package com.example.jyobiken.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
        @NotBlank(message = "名前は必須です") String name,
        @NotBlank(message = "メールアドレスは必須です")
        @Email(message = "正しいメールアドレスを入力してください") String email,
        @NotBlank(message = "パスワードは必須です")
        @Size(min = 8, message = "パスワードは8文字以上で入力してください") String password) {
}
