package com.example.jyobiken.user.service;

import java.util.List;
import java.util.Locale;
import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.jyobiken.user.dto.UserAccessUpdateRequest;
import com.example.jyobiken.user.dto.UserCreateRequest;
import com.example.jyobiken.user.dto.UserResponse;
import com.example.jyobiken.user.dto.UserUpdateRequest;
import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.AppUser;
import com.example.jyobiken.user.entity.UserType;
import com.example.jyobiken.user.exception.BusinessRuleException;
import com.example.jyobiken.user.exception.DuplicateResourceException;
import com.example.jyobiken.user.exception.ResourceNotFoundException;
import com.example.jyobiken.user.mapper.UserMapper;
import com.example.jyobiken.user.repository.UserRepository;
import com.example.jyobiken.user.repository.AdminAuditRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AdminAuditRepository adminAuditRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            AdminAuditRepository adminAuditRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.adminAuditRepository = adminAuditRepository;
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
    public UserResponse createUser(UserCreateRequest request, String actorEmail) {
        String email = normalizeEmail(request.email());
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("Email already registered: " + email);
        }

        AppUser user = userMapper.toEntity(request, passwordEncoder.encode(request.password()));
        Long createdId = userRepository.save(user);
        adminAuditRepository.record(
                actorEmail,
                user.getUserType() == UserType.ADMIN ? "ADMIN_ACCOUNT_ISSUED" : "ACCOUNT_CREATED",
                createdId,
                "userType=" + user.getUserType());
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
    public UserResponse updateAccess(Long id, UserAccessUpdateRequest request, String actorEmail) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found. id=" + id));
        if (request.userType() == UserType.ALUMNI && request.expiresAt() == null) {
            throw new BusinessRuleException("既卒者には利用期限を設定してください。");
        }
        if (request.userType() != UserType.ALUMNI && request.expiresAt() != null) {
            throw new BusinessRuleException("利用期限は既卒者にのみ設定できます。");
        }

        AccountStatus newStatus = request.accountStatus();
        UserType newUserType = request.userType();
        boolean remainsActiveAdmin = newUserType == UserType.ADMIN
                && newStatus == AccountStatus.ACTIVE
                && (request.expiresAt() == null || !request.expiresAt().isBefore(LocalDate.now()));
        boolean isActiveAdmin = user.getUserType() == UserType.ADMIN
                && user.getEffectiveAccountStatus() == AccountStatus.ACTIVE;
        if (isActiveAdmin && !remainsActiveAdmin) {
            userRepository.lockActiveAdmins();
            if (userRepository.countActiveAdminsExcluding(id) == 0) {
                throw new BusinessRuleException("最後の有効な管理者アカウントは変更できません。");
            }
        }

        String oldAccess = accessSummary(user.getUserType(), user.getEffectiveAccountStatus(), user.getExpiresAt());
        user.setUserType(newUserType);
        user.setAccountStatus(newStatus);
        user.setExpiresAt(request.expiresAt());
        userRepository.update(user);

        String newAccess = accessSummary(user.getUserType(), user.getEffectiveAccountStatus(), user.getExpiresAt());
        if (!oldAccess.equals(newAccess)) {
            adminAuditRepository.record(actorEmail, "USER_ACCESS_CHANGED", id, oldAccess + " -> " + newAccess);
        }
        return userMapper.toResponse(user);
    }

    private String accessSummary(UserType userType, AccountStatus accountStatus, LocalDate expiresAt) {
        return "userType=" + userType + ", accountStatus=" + accountStatus + ", expiresAt=" + expiresAt;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
