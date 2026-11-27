package com.example.jyobiken.controller;

import com.example.jyobiken.auth.dto.RegisterRequest;
import com.example.jyobiken.auth.service.RegisterResponse;
import com.example.jyobiken.auth.service.RegisterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            // 受け取ったjsonをregisterRequestに変換
            // @ValidでDTOの要件と一致するか検証
            @Valid @RequestBody RegisterRequest registerRequest) {
        Long userId = registerService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(userId));
    }
}
