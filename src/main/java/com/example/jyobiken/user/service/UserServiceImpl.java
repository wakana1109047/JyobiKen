package com.example.jyobiken.user.service;

import java.util.List;
import java.util.Locale;
import java.time.LocalDate;

import com.example.jyobiken.user.entity.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.jyobiken.user.dto.UserAccessUpdateRequest;
import com.example.jyobiken.user.dto.UserCreateRequest;
import com.example.jyobiken.user.dto.UserResponse;
import com.example.jyobiken.user.dto.UserUpdateRequest;
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
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりませんでした。 id=" + id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request, String actorEmail) {
        // アカウントの作成時の検証
        validatedUserClassification(
                request.studentStage(),
                request.role(),
                request.expiresAt());

        // 学生アカウントに学科設定が必要
        validatedStudentDepartment(request.role(), request.department());

        String email = normalizeEmail(request.email());
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("メールアドレスが既に登録されています：" + email);
        }

        User user = userMapper.toEntity(request, passwordEncoder.encode(request.password()));

        Long createdId = userRepository.save(user);

        adminAuditRepository.record(
                actorEmail,
                user.getRole() == UserRole.ADMIN ? "ADMIN_ACCOUNT_ISSUED" : "ACCOUNT_CREATED",
                createdId,
                "role=" + user.getRole() + ", studentStage=" + user.getStudentStage());
        return getUserById(createdId);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found. id=" + id));

        String email = normalizeEmail(request.email());
        if (!user.getEmail().equals(email) && userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("メールアドレスが既に登録されています： " + email);
        }

        userMapper.updateEntity(user, request);
        userRepository.update(user);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateAccess(Long id, UserAccessUpdateRequest request, String actorEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりませんでした。 id=" + id));

        // 検証
        validatedUserClassification(
                request.studentStage(),
                request.userRole(),
                request.expiresAt());

        validatedStudentDepartment(request.userRole(), user.getDepartment());

        AccountStatus newStatus = request.accountStatus();
        UserRole newRole = request.userRole();

        // 変更後、有効な管理者として残るか
        boolean remainsActiveAdmin = newRole == UserRole.ADMIN
                && newStatus == AccountStatus.ACTIVE;
        // 変更対象は現在有効な管理者か？
        boolean isActiveAdmin = user.getRole() == UserRole.ADMIN
                && user.getEffectiveAccountStatus() == AccountStatus.ACTIVE;

        // 管理者がゼロになってしまう場合を阻止する
        if(!remainsActiveAdmin && isActiveAdmin) {
            userRepository.lockActiveAdmins();
            if (userRepository.countActiveAdminsExcluding(id) == 0) {
                throw new BusinessRuleException("最後の有効な管理者アカウントの状態は変更できません。");
            }
        }

        String oldAccess = accessSummary(user);

        user.setStudentStage(request.studentStage());
        user.setRole(newRole);
        user.setAccountStatus(newStatus);
        user.setExpiresAt(request.expiresAt());
        userRepository.update(user);

        String newAccess = accessSummary(user);
        // ユーザーの状態が変更されている場合、
        if (!oldAccess.equals(newAccess)) {
            // ユーザーの権限変更処理を履歴に残す
            adminAuditRepository.record
                    (actorEmail, "USER_ACCESS_CHANGED",
                            id, oldAccess + " -> " + newAccess);
        }
        return userMapper.toResponse(user);
    }

    /* 学生区分・権限・利用期限の組み合わせを検証するメソッド。
       アカウントの作成・権限変更時に共通で使用する。
       ルールに違反する場合は例外を投げて、保存処理まで進まない
     */
    private void validatedUserClassification(StudentStage studentStage, UserRole role, LocalDate expiresAt){

        // 学生で学生区分の設定がされていない場合
        if(role == UserRole.STUDENT && studentStage == null){
            throw new BusinessRuleException("学生には学生区分の設定が必要です、");
        }
        // 管理者で学生区分が設定されている場合
        if(role == UserRole.ADMIN && studentStage != null){
            throw new BusinessRuleException("管理者には学生区分の設定が出来ません。");
        }
        // 既卒者で利用期限が設定されていない場合
        if(studentStage == StudentStage.GRADUATED && expiresAt == null){
            throw new BusinessRuleException("既卒者には利用期限を設定する必要があります。");
        }
        // 既卒者以外で利用期限が設定されている場合
        if(studentStage != StudentStage.GRADUATED && expiresAt != null){
            throw new BusinessRuleException("利用期限は既卒者のみ設定できます。");
        }
    }

    private void validatedStudentDepartment(UserRole role, String department){
        if(role == UserRole.STUDENT && (department == null || department.isBlank())){
            throw new BusinessRuleException("学生には学科を設定する必要があります。");
        }
    }

    private String accessSummary(User user) {
        return "role=" + user.getRole() +
                ", studentStage=" + user.getStudentStage() +
                ", accountStatus=" + user.getAccountStatus() +
                ", expiresAt=" + user.getExpiresAt();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

}
