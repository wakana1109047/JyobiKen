package com.example.jyobiken.user.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Locale;
import java.util.Objects;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import com.example.jyobiken.user.entity.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;
    private static final String USER_COLUMNS = """
            id, name, email, password_hash, created_at,
            UPPER(student_stage) AS student_stage,
            UPPER(role) AS role,
            UPPER(status) AS account_status,
            expires_at, recovery_email, department,
            school_year, graduation_year
            """;

    // UPPER()でjavaのenumのSTUDENT等に対応させる

    public UserRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<User> findAll() {
        return jdbcTemplate.query(
                "SELECT " + USER_COLUMNS + " FROM users ORDER BY id",
                BeanPropertyRowMapper.newInstance(User.class));
    }

    public Optional<User> findById(Long id) {
        try {
            User user = jdbcTemplate.queryForObject(
                    "SELECT " + USER_COLUMNS + " FROM users WHERE id = ?",
                    BeanPropertyRowMapper.newInstance(User.class),
                    id);

            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException exception) {
            return Optional.empty();
        }
    }

    public Optional<User> findByEmail(String email) {
        try {
            User user = jdbcTemplate.queryForObject(
                    "SELECT " + USER_COLUMNS + " FROM users WHERE email = ?",
                    BeanPropertyRowMapper.newInstance(User.class),
                    email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException exception) {
            return Optional.empty();
        }
    }

    public Long save(User user) {
        // DBが自動発行したID(通常見えない)を受け取るための入れ物を用意する
        KeyHolder keyHolder = new GeneratedKeyHolder();

        // 11個
        jdbcTemplate.update(connection -> {
            PreparedStatement preparedStatement = connection.prepareStatement(
                    """
                        INSERT INTO users (
                            name, email, password_hash, student_stage, role,
                            department, school_year, graduation_year, status,
                            expires_at, recovery_email
                        )
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
            new String[]{"id"});

            //　値のセット
            preparedStatement.setString(1, user.getName());
            preparedStatement.setString(2, user.getEmail());
            preparedStatement.setString(3, user.getPasswordHash());
            preparedStatement.setString(4, user.getStudentStage() == null
                            ? null
                            : user.getStudentStage().name().toLowerCase(Locale.ROOT));
            // enumの定数名をDBで使う小文字に変換
            // Locale.ROOT は、実行するPCの言語設定に左右されずに文字変換するための指定

            preparedStatement.setString(5, user.getRole().name().toLowerCase(Locale.ROOT));
            preparedStatement.setString(6, user.getDepartment());
            preparedStatement.setObject(7, user.getSchoolYear());
            preparedStatement.setObject(8, user.getGraduationYear());
            preparedStatement.setString(9, user.getAccountStatus().name().toLowerCase(Locale.ROOT));
            preparedStatement.setObject(10, user.getExpiresAt());
            preparedStatement.setString(11, user.getRecoveryEmail());

            return preparedStatement;
        }, keyHolder);

        Number generatedKey = keyHolder.getKey();

        // idが取得できたならばLongに変換して返す
        if (generatedKey != null) {
            return generatedKey.longValue();
        }
        throw new IllegalStateException("ユーザーIDを取得できませんでした");
    }

    public int update(User user) {
        return jdbcTemplate.update(
                """
                    UPDATE users
                    SET name = ?, email = ?, password_hash = ?, student_stage = ?, 
                        role = ?, department = ?, school_year = ?,
                        graduation_year = ?, status = ?, expires_at = ?, recovery_email = ?
                    WHERE id = ?
                    """,
                user.getName(), user.getEmail(), user.getPasswordHash(),
                user.getStudentStage() == null
                                ? null
                                : user.getStudentStage().name().toLowerCase(Locale.ROOT),
                user.getRole().name().toLowerCase(Locale.ROOT), user.getDepartment(), user.getSchoolYear(),
                user.getGraduationYear(), user.getAccountStatus().name().toLowerCase(Locale.ROOT),
                user.getExpiresAt(), user.getRecoveryEmail(), user.getId());
    }

    // 指定したユーザー以外に有効な状態の管理者が何人いるかを数える
    public int countActiveAdminsExcluding(Long id) {
        return Objects.requireNonNull(jdbcTemplate.queryForObject(
                // <> で !=
                """
                    SELECT COUNT(*) FROM users WHERE role = 'admin' 
                    AND status = 'active' AND id<> ?
                    """, Integer.class,id));
    }


    // 管理者の変更処理中、対象の行をロックする。同時操作で最後の管理者を失うことを対策する
    public void lockActiveAdmins() {
        jdbcTemplate.queryForList(
                """
                    SELECT id FROM users WHERE role = 'admin'
                    AND status = 'active' ORDER BY id FOR UPDATE
                    """, Long.class);
    }
}
