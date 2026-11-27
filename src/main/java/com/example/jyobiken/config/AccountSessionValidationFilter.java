package com.example.jyobiken.config;

import java.io.IOException;

import com.example.jyobiken.user.entity.User;
import com.example.jyobiken.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.jyobiken.user.entity.AccountStatus;

// ログイン済みのリクエストに対し、今もアカウントが有効か、ログイン時から権限が変更されていないかを確認する
public class AccountSessionValidationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public AccountSessionValidationFilter(UserRepository _userRepository) {
        this.userRepository = _userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            filterChain.doFilter(request, response);
            return;
        }

        var account = userRepository.findByEmail(authentication.getName());

        // アカウントが存在しない、または現在の認証状態が無効な場合
        if (account.isEmpty() || !isCurrent(authentication, account.get())) {
            SecurityContextHolder.clearContext();
            var session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isCurrent(Authentication authentication, User account) {
        // 停止・期限切れの場合は、現在のログイン状態を無効にする
        if (account.getEffectiveAccountStatus() != AccountStatus.ACTIVE) {
            return false;
        }
        // DBの現在の権限と、ログイン時に保持した権限を比較する
        String currentAuthority = "ROLE_" + account.getRole().name();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(currentAuthority::equals);
    }
}
