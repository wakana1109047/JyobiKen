package com.example.jyobiken.user.repository;

import com.example.jyobiken.user.entity.Group;
import com.example.jyobiken.user.mapper.GroupMapper;
import org.springframework.stereotype.Repository;

@Repository
public class GroupRepository {
    private final GroupMapper groupMapper;

    public GroupRepository(GroupMapper groupMapper) {
        this.groupMapper = groupMapper;
    }

}
