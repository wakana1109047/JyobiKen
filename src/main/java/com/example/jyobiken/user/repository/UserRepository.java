package com.example.jyobiken.user.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
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
                "SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt FROM app_user ORDER BY id",
                BeanPropertyRowMapper.newInstance(AppUser.class));
    }

    public Optional<AppUser> findById(Long id) {
        try {
            AppUser user = jdbcTemplate.queryForObject(
                    "SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt FROM app_user WHERE id = ?",
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
                    "SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt FROM app_user WHERE email = ?",
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
                    "INSERT INTO app_user (name, email, password_hash, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
                    Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, user.getName());
            preparedStatement.setString(2, user.getEmail());
            preparedStatement.setString(3, user.getPasswordHash());
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
                "UPDATE app_user SET name = ?, email = ?, password_hash = ? WHERE id = ?",
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getId());
    }

    public int deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM app_user WHERE id = ?", id);
    }
}
