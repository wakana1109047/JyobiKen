package com.example.jyobiken.user.service;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.dto.GroupMemberAddRequest;
import com.example.jyobiken.user.entity.GroupRole;
import com.example.jyobiken.user.exception.BusinessRuleException;
import com.example.jyobiken.user.exception.ResourceNotFoundException;
import com.example.jyobiken.user.repository.GroupMembershipRepository;
import com.example.jyobiken.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@Service
public class GroupMembershipService {
    private final GroupMembershipRepository groupMembershipRepository;
    private final GroupAuthorizationService groupAuthorizationService;
    private final UserRepository userRepository;

    public GroupMembershipService(
            GroupMembershipRepository groupMembershipRepository,
            GroupAuthorizationService groupAuthorizationService,
            UserRepository userRepository) {
        this.groupMembershipRepository = groupMembershipRepository;
        this.groupAuthorizationService = groupAuthorizationService;
        this.userRepository = userRepository;
    }

    @Transactional
    public int addMember(
            Long groupId,
            GroupMemberAddRequest request,
            Authentication authentication){
        groupAuthorizationService.lockGroup(groupId);
        groupAuthorizationService.requireGroupManager(authentication, groupId);
        groupAuthorizationService.requireActiveGroup(groupId);
        if (userRepository.findById(request.userId()).isEmpty()) {
            throw new ResourceNotFoundException("User not found. id=" + request.userId());
        }
        if (groupMembershipRepository.findRole(groupId, request.userId()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "User is already a member of this group.");
        }
        if (request.role() == GroupRole.ADMIN && !groupAuthorizationService.isApplicationAdmin(authentication)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only an application administrator can assign group administrator role.");
        }
        return groupMembershipRepository.addMember(groupId, request.userId(), request.role());
    }

    @Transactional
    public int delete(Long groupId, Long targetUserId, Authentication authentication){
        groupAuthorizationService.lockGroup(groupId);
        groupAuthorizationService.requireGroup(groupId);
        Long currentUserId = groupAuthorizationService.currentUserId(authentication);
        boolean leavingSelf = currentUserId.equals(targetUserId);
        if (!leavingSelf) {
            groupAuthorizationService.requireGroupManager(authentication, groupId);
            groupAuthorizationService.requireActiveGroup(groupId);
        }

        GroupRole targetRole = requireRole(groupId, targetUserId);
        if (!leavingSelf
                && targetRole == GroupRole.ADMIN
                && !groupAuthorizationService.isApplicationAdmin(authentication)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only an application administrator can remove a group administrator.");
        }
        requireAnotherLeaderIfRemovingLeader(groupId, targetRole);
        return groupMembershipRepository.delete(groupId, targetUserId);
    }

    @Transactional
    public int updateRole(
            Long groupId,
            Long targetUserId,
            GroupRole role,
            Authentication authentication){
        groupAuthorizationService.lockGroup(groupId);
        groupAuthorizationService.requireGroupManager(authentication, groupId);
        groupAuthorizationService.requireActiveGroup(groupId);
        GroupRole previousRole = requireRole(groupId, targetUserId);
        if ((role == GroupRole.ADMIN || previousRole == GroupRole.ADMIN)
                && !groupAuthorizationService.isApplicationAdmin(authentication)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only an application administrator can assign or change group administrator role.");
        }
        if (previousRole == GroupRole.LEADER && role != GroupRole.LEADER) {
            requireAnotherLeaderIfRemovingLeader(groupId, previousRole);
        }
        return groupMembershipRepository.updateRole(groupId, targetUserId, role);
    }

    public List<GroupMembershipResponse> findByUserId(Long userId, Authentication authentication){
        if (!groupAuthorizationService.isApplicationAdmin(authentication)
                && !groupAuthorizationService.currentUserId(authentication).equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own memberships.");
        }
        return groupMembershipRepository.findByUserId(userId);
    }

    private GroupRole requireRole(Long groupId, Long userId) {
        return groupMembershipRepository.findRole(groupId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Group membership not found. groupId=" + groupId + ", userId=" + userId));
    }

    private void requireAnotherLeaderIfRemovingLeader(Long groupId, GroupRole targetRole) {
        if (targetRole == GroupRole.LEADER && groupMembershipRepository.countLeaders(groupId) <= 1) {
            throw new BusinessRuleException("A group must have at least one leader.");
        }
    }
}
