package com.example.jyobiken.user.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Group {
    private Long id;
    private String name;
    private String description;
    private String status;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
