package com.example.jyobiken.auth.service;

import com.example.jyobiken.auth.dto.RegisterRequest;
import com.example.jyobiken.enrollment.model.AcademicTerm;
import com.example.jyobiken.enrollment.repository.ProductionEnrollmentRepository;
import com.example.jyobiken.user.entity.*;
import com.example.jyobiken.user.exception.BusinessRuleException;
import com.example.jyobiken.user.exception.DuplicateResourceException;
import com.example.jyobiken.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Locale;

@Service
public class RegisterService {
    private final UserRepository userRepository;
    private final ProductionEnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterService(UserRepository userRepository,
                           ProductionEnrollmentRepository enrollmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Long register(RegisterRequest registerRequest) {

        // パスワードの一致を確認する
        if (!registerRequest.password().equals(registerRequest.passwordConfirm())) {
            throw new BusinessRuleException("パスワードが一致していません");
        }

        String email = registerRequest.email().trim().toLowerCase(Locale.ROOT);


        // morijyobi.ac.jpに限定する
        if (!email.endsWith("@morijyobi.ac.jp")) {
            throw new BusinessRuleException("学校のメールアドレスを入力してください");
        }

        // メールアドレスが既に登録されている場合
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("このメールアドレスは既に登録されています");
        }

        // 学科とその学科で指定できる学年を確認
        Department department = Department.getByDisplayName(registerRequest.department())
                .orElseThrow(() -> new BusinessRuleException("選択された学科は登録できません"));

        int schoolYear = registerRequest.schoolYear();
        if (schoolYear < 1 || schoolYear > department.getDurationYears()) {
            throw new BusinessRuleException("選択された学科の学年を確認してください");
        }

        // 年度・学期・卒業予定年度を計算する
        AcademicTerm term = AcademicTerm.from(
                LocalDate.now(ZoneId.of("Asia/Tokyo")));
        int graduationYear = term.academicYear() + department.getDurationYears() - schoolYear;

        StudentStage stage = graduationYear == term.academicYear()
                ? StudentStage.RESEARCH
                : StudentStage.GENERAL;

        String recoveryEmail = registerRequest.recoveryEmail() == null || registerRequest.recoveryEmail().isBlank()
                ? null
                : registerRequest.recoveryEmail().trim().toLowerCase(Locale.ROOT);

        User user = User.builder()
                .name(registerRequest.name().trim())
                .email(email)
                .recoveryEmail(recoveryEmail)
                .passwordHash(passwordEncoder.encode(registerRequest.password()))
                .role(UserRole.STUDENT)
                .studentStage(stage)
                .department(department.getDisplayName())
                .schoolYear(schoolYear)
                .graduationYear(graduationYear)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        Long userId = userRepository.save(user);

        // 卒業年次以外の学生は今学期の受講するか否かの回答を保存する
        if(stage == StudentStage.GENERAL) {
            enrollmentRepository.save(
                    userId,
                    term.academicYear(),
                    term.semester(),
                    registerRequest.productionEnrolled());
        }

        return userId;
    }
}
