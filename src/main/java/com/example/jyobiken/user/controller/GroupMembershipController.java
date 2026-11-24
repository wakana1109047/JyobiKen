package com.example.jyobiken.user.controller;

import com.example.jyobiken.user.dto.GroupMembershipResponse;
import com.example.jyobiken.user.entity.GroupMembership;
import com.example.jyobiken.user.service.GroupMembershipService;
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
    @PostMapping
    public int insert(@RequestBody GroupMembership membership){
        return groupMembershipService.insert(membership);
    }

    //メンバー脱退
    @DeleteMapping("/{groupId}/{userId")
    public int delete(@PathVariable Long groupId, Long userId){
        return groupMembershipService.delete(groupId,userId);
    }

    //役割変更
    @PutMapping
    public int updateRole(@RequestBody GroupMembership membership){
        return groupMembershipService.updateRole(membership);
    }

    //所属グループ取得
    @GetMapping("/user/{userId}")
    public List<GroupMembershipResponse> findByUserId(@PathVariable Long userId){
        return groupMembershipService.findByUserId(userId);
    }

}
