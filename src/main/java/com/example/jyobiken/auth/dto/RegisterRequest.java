package com.example.jyobiken.auth.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest (
    @NotBlank(message = "名前は必須です")
    @Size(max = 50, message = "名前は50文字以内で入力してください")
    String name,

    @NotBlank(message = "学科は必須です")
    @Size(max = 50, message = "学科は50文字以内で入力してください")
    String department,

    @NotNull(message = "学年は必須です")
    @Min(value = 1, message = "学年は1以上で入力してください")
    Integer schoolYear,

    @NotBlank(message = "学校メール度アドレスは必須です")
    @Email(message = "正しいメールアドレスを入力してください")
    String email,

    @Email(message = "正しい復旧用メールアドレスを入浴してください")
    String recoveryEmail,

    @NotBlank(message = "パスワードは必須です")
    @Size(min = 8, message = "パスワードは8文字以上で入力してください")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*[0-9]).*$",
            message = "パスワードには英字と数字を両方含めてください")
    String password,

    @NotBlank(message = "確認用パスワードは必須です")
    String passwordConfirm,

    @NotNull(message = "修了制作の受講有無を指定してください")
    Boolean productionEnrolled){

}
