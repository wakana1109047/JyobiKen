package com.example.jyobiken.user.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Post {
    private Long id;
    private Long projectId;
    private Long createdByUserId;
    private String content;
    private String status;
    private Integer version;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
