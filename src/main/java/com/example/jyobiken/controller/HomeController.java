package com.example.jyobiken.controller;

import java.util.Locale;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public HomeController(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/")
    public String home() {
        return "research-list";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam("password-confirm") String passwordConfirm,
            Model model) {

        String normalizedName = name == null ? "" : name.trim();
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);

        if (normalizedName.isBlank() || normalizedEmail.isBlank() || password == null || password.isBlank()) {
            model.addAttribute("registrationError", "必須項目を入力してください。");
            return "register";
        }

        if (password.length() < 12) {
            model.addAttribute("registrationError", "パスワードは12文字以上で入力してください。");
            return "register";
        }

        if (!password.equals(passwordConfirm)) {
            model.addAttribute("registrationError", "パスワードと確認用パスワードが一致しません。");
            return "register";
        }

        Integer existingCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE email = ?",
                Integer.class,
                normalizedEmail);

        if (existingCount != null && existingCount > 0) {
            model.addAttribute("registrationError", "このメールアドレスは既に登録されています。");
            return "register";
        }

        String passwordHash = passwordEncoder.encode(password);
        try {
            jdbcTemplate.update(
                    "INSERT INTO app_user "
                            + "(name, email, password_hash, user_type, account_status, created_at) "
                            + "VALUES (?, ?, ?, 'GENERAL_STUDENT', 'ACTIVE', CURRENT_TIMESTAMP)",
                    normalizedName,
                    normalizedEmail,
                    passwordHash);
        } catch (DuplicateKeyException ex) {
            model.addAttribute("registrationError", "このメールアドレスは既に登録されています。");
            return "register";
        }

        return "redirect:/login?registered";
    }
}
