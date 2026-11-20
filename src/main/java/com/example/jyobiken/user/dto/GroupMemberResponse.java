package com.example.jyobiken.user.dto;

import com.example.jyobiken.user.entity.GroupRole;

public record GroupMemberResponse(Long groupId, String groupName, GroupRole role) {
}
