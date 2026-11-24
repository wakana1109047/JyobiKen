package com.example.jyobiken.user.dto;

import com.example.jyobiken.user.entity.GroupRole;

public record GroupMembershipResponse(Long groupId, String groupName, GroupRole role) {
}
