package com.example.jyobiken.user.dto;

import java.util.List;

public record CurrentUserResponse(UserResponse account, List<GroupMembershipResponse> groups) {
}
