package com.example.jyobiken.user.repository;

import java.util.Locale;
import java.util.Optional;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.jyobiken.user.dto.GroupMemberResponse;
import com.example.jyobiken.user.entity.GroupRole;

@Repository
public class GroupMemberRepository {

    private final JdbcTemplate jdbcTemplate;

    public GroupMemberRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<GroupRole> findRole(Long groupId, Long userId) {
        return jdbcTemplate.query(
            """
                SELECT UPPER(role) AS role FROM group_members
                WHERE group_id = ? AND user_id = ?    
                """,
                (resultSet, rowNumbers) ->
                        GroupRole.valueOf(resultSet.getString("role")),
                        groupId,
                        userId).stream().findFirst();
    }

    public int addMember(Long groupId, Long userId, GroupRole role) {
        return jdbcTemplate.update(
            """
                INSERT INTO group_members(group_id, user_id, role)
                VALUES(?, ?, ?)
                """,
                groupId,
                userId,
                role.name().toLowerCase(Locale.ROOT));
    }

    public List<GroupMemberResponse> findByUserId(Long userId) {
        return jdbcTemplate.query(
            """
                SELECT gm.group_id AS groupId,
                g.name AS groupName,
                UPPER(gm.role) AS role
                FROM group_members as gm
                JOIN groups as g ON g.id = gm.group_id
                WHERE gm.user_id = ?
                ORDER BY g.name, gm.group_id        
                """,
                (resultSet, rowNumbers) -> new GroupMemberResponse(
                        resultSet.getLong("groupId"),
                        resultSet.getString("groupName"),
                        GroupRole.valueOf(resultSet.getString("role"))),
                userId);
    }

    public int updateRole(Long groupId, Long userId, GroupRole role) {
        return jdbcTemplate.update(
            """
                UPDATE group_members SET role = ?
                   WHERE group_id = ? AND user_id = ?
                """,
                role.name().toLowerCase(Locale.ROOT),
                groupId,
                userId);
    }
}
