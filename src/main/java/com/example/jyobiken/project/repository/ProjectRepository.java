package com.example.jyobiken.project.repository;

import com.example.jyobiken.project.entity.Project;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProjectRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProjectRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Project> findAll(){
        return jdbcTemplate.query(
                "SELECT id, group_id, title, summary, academic_year, status, created_at, updated_at, completed_at" +
                    " FROM projects ORDER BY id",
                BeanPropertyRowMapper.newInstance(Project.class));
    }
}
