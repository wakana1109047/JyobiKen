package com.example.jyobiken.user.service;

import com.example.jyobiken.user.entity.Group;
import com.example.jyobiken.user.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> findAll(){
        return groupRepository.findAll();
    }

    public Group findById(Long id){
        return groupRepository.findById(id);
    }

    public int insert(Group group){
        return groupRepository.insert(group);
    }

    public int update(Group group){
        return groupRepository.update(group);
    }

    public int delete(Long id){
        return groupRepository.delete(id);
    }
}
