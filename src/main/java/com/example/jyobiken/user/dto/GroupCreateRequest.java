package com.example.jyobiken.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GroupCreateRequest(
        @NotBlank @Size(max = 50) String name,
        String description) {
}
