package com.example.jyobiken.user.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.entity.GroupRole;

@Repository
public class GroupMembershipRepository {

    private final JdbcTemplate jdbcTemplate;

    public GroupMembershipRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<GroupRole> findRole(Long groupId, Long userId) {
        return jdbcTemplate.query(
                "SELECT group_role FROM group_membership WHERE group_id = ? AND user_id = ?",
                (resultSet, rowNumber) -> GroupRole.valueOf(resultSet.getString("group_role")),
                groupId,
                userId).stream().findFirst();
    }

    public int addMember(Long groupId, Long userId, GroupRole role) {
        return jdbcTemplate.update(
                "INSERT INTO group_membership (group_id, user_id, group_role) VALUES (?, ?, ?)",
                groupId,
                userId,
                role.name());
    }

    public List<GroupMembershipResponse> findByUserId(Long userId) {
        return jdbcTemplate.query(
                "SELECT gm.group_id AS groupId, rg.name AS groupName, gm.group_role AS role "
                        + "FROM group_membership gm JOIN research_group rg ON rg.id = gm.group_id "
                        + "WHERE gm.user_id = ? ORDER BY rg.name, gm.group_id",
                (resultSet, rowNumber) -> new GroupMembershipResponse(
                        resultSet.getLong("groupId"),
                        resultSet.getString("groupName"),
                        GroupRole.valueOf(resultSet.getString("role"))),
                userId);
    }

    public int updateRole(Long groupId, Long userId, GroupRole role) {
        return jdbcTemplate.update(
                "UPDATE group_membership SET group_role = ? WHERE group_id = ? AND user_id = ?",
                role.name(),
                groupId,
                userId);
    }
}
