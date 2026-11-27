package com.example.jyobiken.user.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Objects;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.example.jyobiken.user.entity.AppUser;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<AppUser> findAll() {
        return jdbcTemplate.query(
                "SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt, "
                        + "user_type AS userType, account_status AS accountStatus, expires_at AS expiresAt "
                        + "FROM app_user ORDER BY id",
                BeanPropertyRowMapper.newInstance(AppUser.class));
    }

    public Optional<AppUser> findById(Long id) {
        try {
            AppUser user = jdbcTemplate.queryForObject(
                    "SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt, "
                            + "user_type AS userType, account_status AS accountStatus, expires_at AS expiresAt "
                            + "FROM app_user WHERE id = ?",
                    BeanPropertyRowMapper.newInstance(AppUser.class),
                    id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException exception) {
            return Optional.empty();
        }
    }

    public Optional<AppUser> findByEmail(String email) {
        try {
            AppUser user = jdbcTemplate.queryForObject(
                    "SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt, "
                            + "user_type AS userType, account_status AS accountStatus, expires_at AS expiresAt "
                            + "FROM app_user WHERE email = ?",
                    BeanPropertyRowMapper.newInstance(AppUser.class),
                    email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException exception) {
            return Optional.empty();
        }
    }

    public Long save(AppUser user) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement preparedStatement = connection.prepareStatement(
                    "INSERT INTO app_user (name, email, password_hash, user_type, account_status, expires_at, created_at) "
                            + "VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
                    Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, user.getName());
            preparedStatement.setString(2, user.getEmail());
            preparedStatement.setString(3, user.getPasswordHash());
            preparedStatement.setString(4, user.getUserType().name());
            preparedStatement.setString(5, user.getAccountStatus().name());
            preparedStatement.setObject(6, user.getExpiresAt());
            return preparedStatement;
        }, keyHolder);

        Number generatedKey = keyHolder.getKey();
        if (generatedKey != null) {
            return generatedKey.longValue();
        }
        throw new IllegalStateException("User ID generation failed");
    }

    public int update(AppUser user) {
        return jdbcTemplate.update(
                "UPDATE app_user SET name = ?, email = ?, password_hash = ?, user_type = ?, "
                        + "account_status = ?, expires_at = ? WHERE id = ?",
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getUserType().name(),
                user.getAccountStatus().name(),
                user.getExpiresAt(),
                user.getId());
    }

    public int countActiveAdminsExcluding(Long id) {
        return Objects.requireNonNull(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM app_user "
                        + "WHERE user_type = 'ADMIN' AND account_status = 'ACTIVE' "
                        + "AND (expires_at IS NULL OR expires_at >= CURRENT_DATE) AND id <> ?",
                Integer.class,
                id));
    }

    public void lockActiveAdmins() {
        jdbcTemplate.queryForList(
                "SELECT id FROM app_user WHERE user_type = 'ADMIN' AND account_status = 'ACTIVE' "
                        + "AND (expires_at IS NULL OR expires_at >= CURRENT_DATE) ORDER BY id FOR UPDATE",
                Long.class);
    }
}
