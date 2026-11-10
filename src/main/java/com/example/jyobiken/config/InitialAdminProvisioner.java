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
        Integer adminCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE user_type = 'ADMIN'",
                Integer.class);
        if (adminCount != null && adminCount > 0) {
            return;
        }
        if (password.isBlank()) {
            throw new IllegalStateException("Initial admin password must be configured before the first admin is issued.");
        }
        if (password.length() < 12) {
            throw new IllegalStateException("Initial admin password must be at least 12 characters.");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (normalizedEmail.isBlank()) {
            throw new IllegalStateException("Initial admin email cannot be blank.");
        }
        Integer existingUserCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM app_user WHERE email = ?",
                Integer.class,
                normalizedEmail);
        if (existingUserCount != null && existingUserCount > 0) {
            throw new IllegalStateException("Initial admin email is already assigned to a non-admin account.");
        }

        jdbcTemplate.update(
                "INSERT INTO app_user (name, email, password_hash, user_type, account_status) "
                        + "VALUES (?, ?, ?, 'ADMIN', 'ACTIVE')",
                "Administrator",
                normalizedEmail,
                passwordEncoder.encode(password));
        Long adminId = jdbcTemplate.queryForObject(
                "SELECT id FROM app_user WHERE email = ?",
                Long.class,
                normalizedEmail);
        adminAuditRepository.record("SYSTEM", "INITIAL_ADMIN_ISSUED", adminId, "Initial administrator provisioned.");
    }
}
