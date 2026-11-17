package com.example.jyobiken.project.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

public class Project {
    private Long id;
    private Long groupId;
    private String title;
    private String summary;
    private Integer academicYear;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;



}
