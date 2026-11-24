package com.example.jyobiken.user.repository;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.mapper.GroupMembershipMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import com.example.jyobiken.user.entity.GroupRole;

@Repository
public class GroupMembershipRepository {
    private final GroupMembershipMapper groupMembershipMapper;

    public GroupMembershipRepository(GroupMembershipMapper groupMembershipMapper) {
        this.groupMembershipMapper = groupMembershipMapper;
    }

    //メンバー脱退
    public int delete(Long groupId, Long userId){
        return groupMembershipMapper.delete(groupId,userId);
    }

    //役割変更
    public int updateRole(Long groupId, Long userId, GroupRole role){
        return groupMembershipMapper.updateRole(groupId, userId, role);
    }

    //所属グループ取得
    public List<GroupMembershipResponse> findByUserId(Long userId){
        return groupMembershipMapper.findByUserId(userId);
    }

    //役割取得
    public Optional<GroupRole> findRole(Long groupId, Long userId){
        String role = groupMembershipMapper.findRole(groupId, userId);
        if (role == null) {
            return Optional.empty();
        }
        return Optional.of(GroupRole.valueOf(role));
    }

    public int addMember(Long groupId, Long userId, GroupRole role){
        return groupMembershipMapper.addMember(groupId, userId, role);
    }

    public int countLeaders(Long groupId){
        return groupMembershipMapper.countLeaders(groupId);
    }
}
