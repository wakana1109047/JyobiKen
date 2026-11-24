package com.example.jyobiken.user.service;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.entity.GroupMembership;
import com.example.jyobiken.user.repository.GroupMembershipRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.jyobiken.user.entity.GroupRole;

@Service
public class GroupMembershipService {
    private final GroupMembershipRepository groupMembershipRepository;

    public GroupMembershipService(GroupMembershipRepository groupMembershipRepository) {
        this.groupMembershipRepository = groupMembershipRepository;
    }

    public int insert(GroupMembership membership){
        return groupMembershipRepository.insert(membership);
    }

    public int delete(Long groupId, Long userId){
        return groupMembershipRepository.delete(groupId,userId);
    }

    public int updateRole(GroupMembership membership){
        return groupMembershipRepository.updateRole(membership);
    }

    public List<GroupMembershipResponse> findByUserId(Long userId){
        return groupMembershipRepository.findByUserId(userId);
    }

    public Optional<GroupRole> findRole(Long groupId, Long userId){
        return groupMembershipRepository.findRole(groupId,userId);
    }
}
