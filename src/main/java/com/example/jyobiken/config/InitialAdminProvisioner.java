package com.example.jyobiken.config;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.jyobiken.user.repository.AdminAuditRepository;

@Component
public class InitialAdminProvisioner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final AdminAuditRepository adminAuditRepository;
    private final String email;
    private final String password;

    public InitialAdminProvisioner(
            JdbcTemplate jdbcTemplate,
            PasswordEncoder passwordEncoder,
            AdminAuditRepository adminAuditRepository,
            @Value("${app.bootstrap-admin.email:}") String email,
            @Value("${app.bootstrap-admin.password:}") String password) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
        this.adminAuditRepository = adminAuditRepository;
        this.email = email;
        this.password = password;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (email.isBlank()) {
            return;
        }
        // 管理者の数を数える
        Integer adminCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'admin'",
                Integer.class);
        if (adminCount != null && adminCount > 0) {
            return;
        } // パスワードが空白
        if (password.isBlank()) {
            throw new IllegalStateException("管理者のパスワードを設定する必要があります。");
        } // パスワードが8文字より小さい、または英数字が混在していない
        if (password.length() < 8
            || !password.matches(".*[A-Za-z].*")
            || !password.matches(".*[0-9].*")){
            throw new IllegalStateException("管理者のパスワードは8文字以上必要です。また、英字と数字が両方含まれている必要があります。");
        }

        // メールアドレスの重複確認
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (normalizedEmail.isBlank()) {
            throw new IllegalStateException("Initial admin email cannot be blank.");
        }
        Integer existingUserCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ?",
                Integer.class,
                normalizedEmail);
        if (existingUserCount != null && existingUserCount > 0) {
            throw new IllegalStateException("このメールアドレスは既に登録されています。");
        }

        jdbcTemplate.update(
                """
                    INSERT INTO users 
                    (name, email, password_hash, student_stage, role, status)
                    VALUES(?, ?, ?, null, 'admin', 'active')
                    """,
                "Administrator",
                normalizedEmail,
                passwordEncoder.encode(password));
        Long adminId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?",
                Long.class,
                normalizedEmail);
        adminAuditRepository.record("SYSTEM", "INITIAL_ADMIN_ISSUED", adminId, "Initial administrator provisioned.");
    }
}
