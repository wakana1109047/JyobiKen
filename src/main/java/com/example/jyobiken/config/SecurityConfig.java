package com.example.jyobiken.config;

import java.util.Locale;
import java.time.LocalDate;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import com.example.jyobiken.user.entity.AccountStatus;
import com.example.jyobiken.user.entity.UserType;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JdbcTemplate jdbcTemplate) throws Exception {
        return http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users", "/api/users/**", "/api/admin", "/api/admin/**",
                                "/admin/**", "/admin-*.html").hasRole("ADMIN")
                        .requestMatchers("/login", "/register", "/error", "/h2-console/**", "/css/**", "/js/**", "/images/**", "/node_modules/bootstrap/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                        .anyRequest().authenticated())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/api/auth/login")
                        .usernameParameter("email")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        })
                        .permitAll())

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID"))
                .addFilterBefore(new AccountSessionValidationFilter(jdbcTemplate), AuthorizationFilter.class)
                .build();
    }

    @Bean
    UserDetailsService userDetailsService(JdbcTemplate jdbcTemplate) {
        return email -> {
            String normalizedEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
            try {
                return jdbcTemplate.queryForObject(
                        "SELECT email, password_hash, user_type, account_status, expires_at "
                                + "FROM app_user WHERE email = ?",
                        (resultSet, rowNumber) -> {
                            UserType userType = UserType.valueOf(resultSet.getString("user_type"));
                            AccountStatus accountStatus = AccountStatus.valueOf(
                                    resultSet.getString("account_status"));
                            LocalDate expiresAt = resultSet.getObject("expires_at", LocalDate.class);
                            boolean expired = accountStatus == AccountStatus.EXPIRED
                                    || (userType == UserType.ALUMNI
                                            && expiresAt != null
                                            && expiresAt.isBefore(LocalDate.now()));

                            return User.withUsername(resultSet.getString("email"))
                                    .password(resultSet.getString("password_hash"))
                                    .roles(userType.name())
                                    .disabled(accountStatus == AccountStatus.SUSPENDED)
                                    .accountExpired(expired)
                                    .build();
                        },
                        normalizedEmail);
            } catch (EmptyResultDataAccessException exception) {
                throw new UsernameNotFoundException("Account not found", exception);
            }
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
