package com.example.jyobiken;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.MockMvc;

import com.example.jyobiken.user.entity.GroupRole;
import com.example.jyobiken.user.repository.GroupMembershipRepository;

@SpringBootTest
@AutoConfigureMockMvc
class JyobiKenApplicationTests {

    private static final String EMAIL = "login-test@example.com";
    private static final String ADMIN_EMAIL = "login-admin@example.com";
    private static final String GROUP_MEMBER_EMAIL = "group-member-test@example.com";
    private static final String PASSWORD = "ValidPassword123!";
    private final List<Long> testGroupIds = new ArrayList<>();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GroupMembershipRepository groupMembershipRepository;

    @BeforeEach
    void createLoginTestUser() {
        testGroupIds.clear();
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", EMAIL);
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", ADMIN_EMAIL);
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", GROUP_MEMBER_EMAIL);
        jdbcTemplate.update(
                "INSERT INTO app_user (name, email, password_hash) VALUES (?, ?, ?)",
                "Login Test",
                EMAIL,
                passwordEncoder.encode(PASSWORD));
        jdbcTemplate.update(
                "INSERT INTO app_user (name, email, password_hash, user_type) VALUES (?, ?, ?, 'ADMIN')",
                "Login Admin",
                ADMIN_EMAIL,
                passwordEncoder.encode(PASSWORD));
        jdbcTemplate.update(
                "INSERT INTO app_user (name, email, password_hash) VALUES (?, ?, ?)",
                "Group Member",
                GROUP_MEMBER_EMAIL,
                passwordEncoder.encode(PASSWORD));
    }

    @AfterEach
    void removeLoginTestUser() {
        testGroupIds.forEach(groupId ->
                jdbcTemplate.update("DELETE FROM research_group WHERE id = ?", groupId));
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", EMAIL);
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", ADMIN_EMAIL);
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", GROUP_MEMBER_EMAIL);
    }

    @Test
    void contextLoads() {
    }

    @Test
    void loginPageRendersFormWithCsrfToken() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("name=\"_csrf\"")));
    }

    @Test
    void validCredentialsAuthenticateAndRedirectToHome() throws Exception {
        mockMvc.perform(post("/login")
                        .with(csrf())
                        .param("email", EMAIL)
                        .param("password", PASSWORD))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/"));
    }

    @Test
    void invalidCredentialsRedirectBackToLogin() throws Exception {
        mockMvc.perform(post("/login")
                        .with(csrf())
                        .param("email", EMAIL)
                        .param("password", "incorrect"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error"));
    }

    @Test
    void studentCannotManageUsers() throws Exception {
        mockMvc.perform(get("/api/users").with(user(EMAIL).roles("GENERAL_STUDENT")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminAccountManagementPageIsRestrictedToAdmins() throws Exception {
        mockMvc.perform(get("/admin-accounts.html").with(user(EMAIL).roles("GENERAL_STUDENT")))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/admin-accounts.html").with(user(ADMIN_EMAIL).roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("アカウント管理")))
                .andExpect(content().string(containsString("name=\"_csrf\"")));
    }

    @Test
    void adminCanChangeUserAccessAndTheChangeIsAudited() throws Exception {
        Long userId = testUserId();
        mockMvc.perform(patch("/api/users/{id}/access", userId)
                        .with(user(ADMIN_EMAIL).roles("ADMIN"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userType":"RESEARCH_STUDENT","accountStatus":"ACTIVE","expiresAt":null}
                                """))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("\"userType\":\"RESEARCH_STUDENT\"")));

        assertEquals(
                "RESEARCH_STUDENT",
                jdbcTemplate.queryForObject(
                        "SELECT user_type FROM app_user WHERE email = ?",
                        String.class,
                        EMAIL));
        assertEquals(
                1,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM admin_audit_log WHERE action = 'USER_ACCESS_CHANGED' AND target_id = ?",
                        Integer.class,
                        userId));
    }

    @Test
    void suspendedAccountCannotLogIn() throws Exception {
        jdbcTemplate.update("UPDATE app_user SET account_status = 'SUSPENDED' WHERE email = ?", EMAIL);

        mockMvc.perform(post("/login")
                        .with(csrf())
                        .param("email", EMAIL)
                        .param("password", PASSWORD))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error"));
    }

    @Test
    void expiredAccountCannotLogIn() throws Exception {
        jdbcTemplate.update(
                "UPDATE app_user SET user_type = 'ALUMNI', expires_at = ? WHERE email = ?",
                LocalDate.now().minusDays(1),
                EMAIL);

        mockMvc.perform(post("/login")
                        .with(csrf())
                        .param("email", EMAIL)
                        .param("password", PASSWORD))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error"));
    }

    @Test
    void publicRegistrationCannotAssignAdminRole() throws Exception {
        String newEmail = "registration-" + UUID.randomUUID() + "@example.com";
        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("name", "New Student")
                        .param("email", newEmail)
                        .param("password", "ValidPassword123!")
                        .param("password-confirm", "ValidPassword123!")
                        .param("userType", "ADMIN"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?registered"));

        assertEquals(
                "GENERAL_STUDENT",
                jdbcTemplate.queryForObject(
                        "SELECT user_type FROM app_user WHERE email = ?",
                        String.class,
                        newEmail));
        jdbcTemplate.update("DELETE FROM app_user WHERE email = ?", newEmail);
    }

    @Test
    void activeSessionIsInvalidatedWhenAccountIsSuspended() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/login")
                        .with(csrf())
                        .param("email", EMAIL)
                        .param("password", PASSWORD))
                .andExpect(status().is3xxRedirection())
                .andReturn();
        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session);

        jdbcTemplate.update("UPDATE app_user SET account_status = 'SUSPENDED' WHERE email = ?", EMAIL);

        mockMvc.perform(get("/").session(session))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?reauth"));
    }

    @Test
    void lastActiveAdminCannotBeSuspended() throws Exception {
        mockMvc.perform(patch("/api/users/{id}/access", testAdminId())
                        .with(user(ADMIN_EMAIL).roles("ADMIN"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userType":"ADMIN","accountStatus":"SUSPENDED","expiresAt":null}
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void groupRoleIsStoredSeparatelyFromUserType() {
        String groupName = "role-test-" + UUID.randomUUID();
        jdbcTemplate.update("INSERT INTO research_group (name) VALUES (?)", groupName);
        Long groupId = jdbcTemplate.queryForObject(
                "SELECT id FROM research_group WHERE name = ?",
                Long.class,
                groupName);
        testGroupIds.add(groupId);
        Long userId = jdbcTemplate.queryForObject(
                "SELECT id FROM app_user WHERE email = ?",
                Long.class,
                EMAIL);

        groupMembershipRepository.addMember(groupId, userId, GroupRole.LEADER);

        assertEquals(
                GroupRole.LEADER,
                groupMembershipRepository.findRole(groupId, userId).orElseThrow());
    }

    @Test
    void groupCreatorBecomesItsLeader() throws Exception {
        String groupName = "new-" + UUID.randomUUID();

        mockMvc.perform(post("/api/groups")
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"%s","description":"Created in test"}
                                """.formatted(groupName)))
                .andExpect(status().isOk());

        Long groupId = jdbcTemplate.queryForObject(
                "SELECT id FROM research_group WHERE name = ?",
                Long.class,
                groupName);
        testGroupIds.add(groupId);
        assertEquals(
                testUserId(),
                jdbcTemplate.queryForObject(
                        "SELECT created_by FROM research_group WHERE id = ?", Long.class, groupId));
        assertEquals(
                GroupRole.LEADER,
                groupMembershipRepository.findRole(groupId, testUserId()).orElseThrow());
    }

    @Test
    void groupLeaderCanAddMembersButRegularMembersCannot() throws Exception {
        Long groupId = createGroupWithRole(GroupRole.LEADER);
        groupMembershipRepository.addMember(groupId, groupMemberId(), GroupRole.MEMBER);

        mockMvc.perform(post("/api/group-memberships/{groupId}", groupId)
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userId":%d,"role":"MEMBER"}
                                """.formatted(testAdminId())))
                .andExpect(status().isOk());

        assertEquals(
                GroupRole.MEMBER,
                groupMembershipRepository.findRole(groupId, testAdminId()).orElseThrow());

        mockMvc.perform(post("/api/group-memberships/{groupId}", groupId)
                        .with(user(GROUP_MEMBER_EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userId":%d,"role":"MEMBER"}
                                """.formatted(testUserId())))
                .andExpect(status().isForbidden());
    }

    @Test
    void applicationAdminCanAssignGroupAdminRole() throws Exception {
        Long groupId = createGroupWithRole(GroupRole.LEADER);

        mockMvc.perform(post("/api/group-memberships/{groupId}", groupId)
                        .with(user(ADMIN_EMAIL).roles("ADMIN"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userId":%d,"role":"ADMIN"}
                                """.formatted(groupMemberId())))
                .andExpect(status().isOk());

        assertEquals(
                GroupRole.ADMIN,
                groupMembershipRepository.findRole(groupId, groupMemberId()).orElseThrow());
    }

    @Test
    void groupAdministratorCanManageGroupButCannotGrantAdministratorRole() throws Exception {
        Long groupId = createGroupWithRole(GroupRole.ADMIN);

        mockMvc.perform(put("/api/groups/{id}", groupId)
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"managed-group","description":"Updated by group admin"}
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/group-memberships/{groupId}", groupId)
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userId":%d,"role":"ADMIN"}
                                """.formatted(groupMemberId())))
                .andExpect(status().isForbidden());
    }

    @Test
    void lastLeaderCannotLeaveGroup() throws Exception {
        Long groupId = createGroupWithRole(GroupRole.LEADER);

        mockMvc.perform(delete("/api/group-memberships/{groupId}/{userId}", groupId, testUserId())
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf()))
                .andExpect(status().isConflict());

        assertEquals(1, groupMembershipRepository.countLeaders(groupId));
    }

    @Test
    void endedGroupRejectsMembershipChanges() throws Exception {
        Long groupId = createGroupWithRole(GroupRole.LEADER);

        mockMvc.perform(post("/api/groups/{id}/end", groupId)
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf()))
                .andExpect(status().isOk());

        assertEquals(
                "ended",
                jdbcTemplate.queryForObject(
                        "SELECT status FROM research_group WHERE id = ?", String.class, groupId));

        mockMvc.perform(post("/api/group-memberships/{groupId}", groupId)
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userId":%d,"role":"MEMBER"}
                                """.formatted(testAdminId())))
                .andExpect(status().isConflict());
    }

    @Test
    void deletingGroupKeepsItsHistoryAsSoftDeleted() throws Exception {
        Long groupId = createGroupWithRole(GroupRole.LEADER);

        mockMvc.perform(delete("/api/groups/{id}", groupId)
                        .with(user(EMAIL).roles("GENERAL_STUDENT"))
                        .with(csrf()))
                .andExpect(status().isOk());

        assertEquals(
                "deleted",
                jdbcTemplate.queryForObject(
                        "SELECT status FROM research_group WHERE id = ?", String.class, groupId));
        assertEquals(
                0,
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM research_group WHERE id = ? AND LOWER(status) <> 'deleted'",
                        Integer.class,
                        groupId));
    }

    @Test
    void currentUserEndpointShowsAccountTypeAndGroupRole() throws Exception {
        String groupName = "current-user-" + UUID.randomUUID();
        jdbcTemplate.update("INSERT INTO research_group (name) VALUES (?)", groupName);
        Long groupId = jdbcTemplate.queryForObject(
                "SELECT id FROM research_group WHERE name = ?",
                Long.class,
                groupName);
        testGroupIds.add(groupId);
        groupMembershipRepository.addMember(groupId, testUserId(), GroupRole.LEADER);

        mockMvc.perform(get("/api/me").with(user(EMAIL).roles("GENERAL_STUDENT")))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("\"userType\":\"GENERAL_STUDENT\"")))
                .andExpect(content().string(containsString("\"role\":\"LEADER\"")))
                .andExpect(content().string(containsString(groupName)));
    }

    private Long testUserId() {
        return jdbcTemplate.queryForObject(
                "SELECT id FROM app_user WHERE email = ?",
                Long.class,
                EMAIL);
    }

    private Long testAdminId() {
        return jdbcTemplate.queryForObject(
                "SELECT id FROM app_user WHERE email = ?",
                Long.class,
                ADMIN_EMAIL);
    }

    private Long groupMemberId() {
        return jdbcTemplate.queryForObject(
                "SELECT id FROM app_user WHERE email = ?",
                Long.class,
                GROUP_MEMBER_EMAIL);
    }

    private Long createGroupWithRole(GroupRole role) {
        String groupName = "g-" + UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO research_group (name, created_by) VALUES (?, ?)",
                groupName,
                testUserId());
        Long groupId = jdbcTemplate.queryForObject(
                "SELECT id FROM research_group WHERE name = ?",
                Long.class,
                groupName);
        testGroupIds.add(groupId);
        groupMembershipRepository.addMember(groupId, testUserId(), role);
        return groupId;
    }
}
