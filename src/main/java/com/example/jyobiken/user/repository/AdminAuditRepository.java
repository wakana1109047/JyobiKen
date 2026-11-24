package com.example.jyobiken.user.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.jyobiken.user.dto.AdminAuditEntry;

@Repository
public class AdminAuditRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminAuditRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void record(String actorEmail, String action, Long targetId, String details) {
        jdbcTemplate.update(
                "INSERT INTO admin_audit_log (actor_email, action, target_type, target_id, details) "
                        + "VALUES (?, ?, 'USER', ?, ?)",
                actorEmail,
                action,
                targetId,
                details);
    }

    public List<AdminAuditEntry> findAll() {
        return jdbcTemplate.query(
                "SELECT id, actor_email AS actorEmail, action, target_type AS targetType, "
                        + "target_id AS targetId, details, created_at AS createdAt "
                        + "FROM admin_audit_log ORDER BY created_at DESC, id DESC",
                (resultSet, rowNumber) -> new AdminAuditEntry(
                        resultSet.getLong("id"),
                        resultSet.getString("actorEmail"),
                        resultSet.getString("action"),
                        resultSet.getString("targetType"),
                        resultSet.getObject("targetId", Long.class),
                        resultSet.getString("details"),
                        resultSet.getObject("createdAt", LocalDateTime.class)));
    }
}
