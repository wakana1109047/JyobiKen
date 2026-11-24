package com.example.jyobiken.user.mapper;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GroupMembershipMapper {

    // 脱退
    @Delete("""
        DELETE FROM group_membership
        WHERE group_id = #{groupId}
          AND user_id = #{userId}
    """)
    int delete(
            @Param("groupId") Long groupId,
            @Param("userId") Long userId
    );

    // 役割変更
    @Update("""
        UPDATE group_membership
        SET group_role = #{role}
        WHERE group_id = #{groupId}
          AND user_id = #{userId}
    """)
    int updateRole(
            @Param("groupId") Long groupId,
            @Param("userId") Long userId,
            @Param("role") com.example.jyobiken.user.entity.GroupRole role);

    @Insert("""
        INSERT INTO group_membership (group_id, user_id, group_role)
        VALUES (#{groupId}, #{userId}, #{role})
    """)
    int addMember(
            @Param("groupId") Long groupId,
            @Param("userId") Long userId,
            @Param("role") com.example.jyobiken.user.entity.GroupRole role
    );

    // 役割取得
    @Select("""
        SELECT group_role
        FROM group_membership
        WHERE group_id = #{groupId}
          AND user_id = #{userId}
    """)
    String findRole(
            @Param("groupId") Long groupId,
            @Param("userId") Long userId
    );

    @Select("""
        SELECT COUNT(*)
        FROM group_membership
        WHERE group_id = #{groupId}
          AND group_role = 'LEADER'
    """)
    int countLeaders(@Param("groupId") Long groupId);

    // 所属グループ取得
    @Select("""
        SELECT
            gm.group_id AS groupId,
            rg.name AS groupName,
            gm.group_role AS role
        FROM group_membership gm
        JOIN research_group rg
          ON rg.id = gm.group_id
        WHERE gm.user_id = #{userId}
          AND LOWER(rg.status) <> 'deleted'
        ORDER BY rg.name, gm.group_id
    """)
    List<GroupMembershipResponse> findByUserId(Long userId);
}