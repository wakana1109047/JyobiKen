package com.example.jyobiken.project.dto;

public record ProjectResponse (
        Long id,
        Long groupId,
        String title,
        String summary,
        Integer academicYear,
        String status
) {
}
