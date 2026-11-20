package com.example.jyobiken.user.controller;

import com.example.jyobiken.user.entity.Group;
import com.example.jyobiken.user.service.GroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/groups")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }
    @GetMapping
    public List<Group> findAll(){
        return groupService.findAll();
    }

    @GetMapping("/{id}")
    public Group findById(@PathVariable Long id){
        return groupService.findById(id);
    }

    @PostMapping
    public int insert(@RequestBody Group group){
        return groupService.insert(group);
    }

    @PutMapping("/{id}")
    public int update(@PathVariable Long id,
                      @RequestBody Group group){

        group.setId(id);
        return groupService.update(group);
    }

    @DeleteMapping("/{id}")
    public int delete(@PathVariable Long id){
        return groupService.delete(id);
    }
}
