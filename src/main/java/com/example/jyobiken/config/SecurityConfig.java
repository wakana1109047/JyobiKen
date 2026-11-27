package com.example.jyobiken.config;

import java.util.Locale;
import java.time.LocalDate;

import com.example.jyobiken.user.repository.UserRepository;
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
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, UserRepository userRepository) throws Exception {
        return http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users", "/api/users/**", "/api/admin", "/api/admin/**",
                                "/admin/**", "/admin-*.html").hasRole("ADMIN")
                        .requestMatchers("/login", "/register", "/error", "/h2-console/**", "/css/**", "/js/**", "/images/**", "/node_modules/bootstrap/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                        .requestMatchers("/api/auth/csrf").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .anyRequest().authenticated())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        }))
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
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                            // 成功時に204を返す
                        })
                        // サーバーのセッションを無効化
                        .invalidateHttpSession(true)
                        // 認証譲歩を解除する
                        .clearAuthentication(true)
                        // クッキー削除
                        .deleteCookies("JSESSIONID"))
                .addFilterBefore(new AccountSessionValidationFilter(userRepository), AuthorizationFilter.class)
                .build();
    }

    @Bean
    // // Repositoryを使い、ログイン時もusersテーブルから取得する
    UserDetailsService userDetailsService(UserRepository userRepository) {
        return email -> {
            // normalized -> nullなら空文字に。それ以外は前後の空白を除去して小文字にする
            String normalizedEmail = email == null
                    ? ""
                    : email.trim().toLowerCase(Locale.ROOT);

            var account = userRepository.findByEmail(normalizedEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("アカウントが見つかりませんでした"));

            AccountStatus status = account.getEffectiveAccountStatus();

            return User.withUsername(account.getEmail())
                    .password(account.getPasswordHash())
                    .roles(account.getRole().name())
                    .disabled(status == AccountStatus.SUSPENDED)
                    .accountExpired(status == AccountStatus.EXPIRED)
                    .build();
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
