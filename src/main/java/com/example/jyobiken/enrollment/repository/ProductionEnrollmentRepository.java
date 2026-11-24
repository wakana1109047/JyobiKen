package com.example.jyobiken.enrollment.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProductionEnrollmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductionEnrollmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 指定された年度・学期の受講回答を新規保存する
    public int save(Long userId, int academicYear, int semester, boolean enrolled){

        return jdbcTemplate.update(
            """
                INSERT INTO production_enrollments (
                user_id, academic_year, semester, is_enrolled
                ) VALUES (?, ?, ?, ?)
                """
                , userId, academicYear, semester, enrolled);
    }

}