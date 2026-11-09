package com.example.jyobiken.user.service;

import java.util.List;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.jyobiken.user.dto.UserCreateRequest;
import com.example.jyobiken.user.dto.UserResponse;
import com.example.jyobiken.user.dto.UserUpdateRequest;
import com.example.jyobiken.user.entity.AppUser;
import com.example.jyobiken.user.exception.DuplicateResourceException;
import com.example.jyobiken.user.exception.ResourceNotFoundException;
import com.example.jyobiken.user.mapper.UserMapper;
import com.example.jyobiken.user.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found. id=" + id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("Email already registered: " + email);
        }

        AppUser user = userMapper.toEntity(request, passwordEncoder.encode(request.password()));
        Long createdId = userRepository.save(user);
        return getUserById(createdId);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found. id=" + id));

        String email = normalizeEmail(request.email());
        if (!user.getEmail().equals(email) && userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("Email already registered: " + email);
        }

        userMapper.updateEntity(user, request);
        userRepository.update(user);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (userRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("User not found. id=" + id);
        }
        userRepository.deleteById(id);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
