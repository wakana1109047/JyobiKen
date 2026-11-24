package com.example.jyobiken.user.controller;

import com.example.jyobiken.user.dto.GroupMemberAddRequest;
import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.dto.GroupRoleUpdateRequest;
import com.example.jyobiken.user.service.GroupMembershipService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-memberships")
public class GroupMembershipController {

    private final GroupMembershipService groupMembershipService;

    public GroupMembershipController(GroupMembershipService groupMembershipService) {
        this.groupMembershipService = groupMembershipService;
    }

    //メンバー追加
    @PostMapping("/{groupId}")
    public int insert(
            @PathVariable Long groupId,
            @Valid @RequestBody GroupMemberAddRequest request,
            Authentication authentication){
        return groupMembershipService.addMember(groupId, request, authentication);
    }

    //メンバー脱退
    @DeleteMapping("/{groupId}/{userId}")
    public int delete(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            Authentication authentication){
        return groupMembershipService.delete(groupId, userId, authentication);
    }

    //役割変更
    @PutMapping("/{groupId}/{userId}")
    public int updateRole(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @Valid @RequestBody GroupRoleUpdateRequest request,
            Authentication authentication){
        return groupMembershipService.updateRole(groupId, userId, request.role(), authentication);
    }

    //所属グループ取得
    @GetMapping("/user/{userId}")
    public List<GroupMembershipResponse> findByUserId(
            @PathVariable Long userId,
            Authentication authentication){
        return groupMembershipService.findByUserId(userId, authentication);
    }

}
