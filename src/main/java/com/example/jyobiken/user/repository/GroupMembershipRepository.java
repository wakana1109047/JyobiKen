package com.example.jyobiken.user.repository;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.entity.GroupMembership;
import com.example.jyobiken.user.mapper.GroupMembershipMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GroupMembershipRepository {
    private final GroupMembershipMapper groupMembershipMapper;

    public GroupMembershipRepository(GroupMembershipMapper groupMembershipMapper) {
        this.groupMembershipMapper = groupMembershipMapper;
    }

    //メンバー追加
    public int insert(GroupMembership membership){
        return groupMembershipMapper.insert(membership);
    }

    //メンバー脱退
    public int delete(Long groupId, Long userId){
        return groupMembershipMapper.delete(groupId,userId);
    }

    //役割変更
    public int updateRole(GroupMembership membership){
        return groupMembershipMapper.updateRole(membership);
    }

    //所属グループ取得
    public List<GroupMembershipResponse> findByUserId(Long userId){
        return groupMembershipMapper.findByUserId(userId);
    }

    //役割取得
    public String findRole(Long groupId, Long userId){
        return groupMembershipMapper.findRole(groupId,userId);
    }
}
