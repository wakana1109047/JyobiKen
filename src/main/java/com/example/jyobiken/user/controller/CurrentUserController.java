package com.example.jyobiken.user.controller;

import com.example.jyobiken.user.repository.GroupMemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jyobiken.user.dto.CurrentUserResponse;
import com.example.jyobiken.user.exception.ResourceNotFoundException;
import com.example.jyobiken.user.mapper.UserMapper;
import com.example.jyobiken.user.repository.UserRepository;

@RestController
@RequestMapping("/api/me")
public class CurrentUserController {

    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserMapper userMapper;

    public CurrentUserController(
            UserRepository userRepository,
            GroupMemberRepository groupMemberRepository,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userMapper = userMapper;
    }

    @GetMapping
    public CurrentUserResponse getCurrentUser(Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Current user account not found."));
        return new CurrentUserResponse(
                userMapper.toResponse(user),
                groupMemberRepository.findByUserId(user.getId()));
    }
}
