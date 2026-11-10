package com.example.jyobiken.config;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.UserType;

public class AccountSessionValidationFilter extends OncePerRequestFilter {

    private final JdbcTemplate jdbcTemplate;

    public AccountSessionValidationFilter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
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

        List<AccountState> accountStates = jdbcTemplate.query(
                "SELECT user_type, account_status, expires_at FROM app_user WHERE email = ?",
                (resultSet, rowNumber) -> new AccountState(
                        UserType.valueOf(resultSet.getString("user_type")),
                        AccountStatus.valueOf(resultSet.getString("account_status")),
                        resultSet.getObject("expires_at", LocalDate.class)),
                authentication.getName());

        if (accountStates.isEmpty() || !isCurrent(authentication, accountStates.get(0))) {
            SecurityContextHolder.clearContext();
            var session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendRedirect("/login?reauth");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isCurrent(Authentication authentication, AccountState account) {
        if (account.status() != AccountStatus.ACTIVE
                || (account.userType() == UserType.ALUMNI
                        && account.expiresAt() != null
                        && account.expiresAt().isBefore(LocalDate.now()))) {
            return false;
        }
        String currentAuthority = "ROLE_" + account.userType();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(currentAuthority::equals);
    }

    private record AccountState(UserType userType, AccountStatus status, LocalDate expiresAt) {
    }
}
