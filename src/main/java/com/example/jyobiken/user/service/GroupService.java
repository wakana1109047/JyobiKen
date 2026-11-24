package com.example.jyobiken.user.service;

import com.example.jyobiken.user.dto.GroupCreateRequest;
import com.example.jyobiken.user.dto.GroupUpdateRequest;
import com.example.jyobiken.user.entity.Group;
import com.example.jyobiken.user.entity.GroupRole;
import com.example.jyobiken.user.entity.GroupStatus;
import com.example.jyobiken.user.repository.GroupMembershipRepository;
import com.example.jyobiken.user.repository.GroupRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final GroupAuthorizationService groupAuthorizationService;

    public GroupService(
            GroupRepository groupRepository,
            GroupMembershipRepository groupMembershipRepository,
            GroupAuthorizationService groupAuthorizationService) {
        this.groupRepository = groupRepository;
        this.groupMembershipRepository = groupMembershipRepository;
        this.groupAuthorizationService = groupAuthorizationService;
    }

    public List<Group> findAll(){
        return groupRepository.findAll();
    }

    public Group findById(Long id){
        return groupAuthorizationService.requireGroup(id);
    }

    @Transactional
    public int insert(GroupCreateRequest request, Authentication authentication){
        Group group = new Group();
        group.setName(request.name().trim());
        group.setDescription(request.description());
        group.setStatus(GroupStatus.ACTIVE.getValue());
        group.setCreatedBy(groupAuthorizationService.currentUserId(authentication));
        int inserted = groupRepository.insert(group);
        if (inserted != 1 || group.getId() == null) {
            throw new IllegalStateException("Group creation failed.");
        }
        groupMembershipRepository.addMember(
                group.getId(), group.getCreatedBy(), GroupRole.LEADER);
        return inserted;
    }

    @Transactional
    public int update(Long id, GroupUpdateRequest request, Authentication authentication){
        groupAuthorizationService.lockGroup(id);
        groupAuthorizationService.requireGroupManager(authentication, id);
        groupAuthorizationService.requireActiveGroup(id);
        Group group = groupAuthorizationService.requireGroup(id);
        group.setName(request.name().trim());
        group.setDescription(request.description());
        return groupRepository.update(group);
    }

    @Transactional
    public int end(Long id, Authentication authentication){
        groupAuthorizationService.lockGroup(id);
        groupAuthorizationService.requireGroupManager(authentication, id);
        groupAuthorizationService.requireActiveGroup(id);
        return groupRepository.updateStatus(id, GroupStatus.ENDED.getValue());
    }

    @Transactional
    public int delete(Long id, Authentication authentication){
        groupAuthorizationService.lockGroup(id);
        groupAuthorizationService.requireGroupManager(authentication, id);
        return groupRepository.softDelete(id);
    }
}
