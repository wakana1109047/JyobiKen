package com.example.jyobiken.user.service;

import java.util.List;

import com.example.jyobiken.user.dto.UserCreateRequest;
import com.example.jyobiken.user.dto.UserAccessUpdateRequest;
import com.example.jyobiken.user.dto.UserResponse;
import com.example.jyobiken.user.dto.UserUpdateRequest;

public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserCreateRequest request, String actorEmail);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    UserResponse updateAccess(Long id, UserAccessUpdateRequest request, String actorEmail);
}
