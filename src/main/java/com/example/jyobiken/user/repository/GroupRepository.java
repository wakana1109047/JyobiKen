package com.example.jyobiken.user.repository;

import com.example.jyobiken.user.entity.Group;
import com.example.jyobiken.user.mapper.GroupMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GroupRepository {
    private final GroupMapper groupMapper;

    public GroupRepository(GroupMapper groupMapper) {
        this.groupMapper = groupMapper;
    }

    public List<Group> findAll(){
        return groupMapper.findAll();
    }

    public Group findById(Long id){
        return groupMapper.findById(id);
    }

    public int insert(Group group){
        return groupMapper.insert(group);
    }

    public int update(Group group){
        return groupMapper.update(group);
    }

    public int delete(Long id){
        return groupMapper.delete(id);
    }
}
