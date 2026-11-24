package com.example.jyobiken.user.controller;

import com.example.jyobiken.user.dto.GroupCreateRequest;
import com.example.jyobiken.user.dto.GroupUpdateRequest;
import com.example.jyobiken.user.entity.Group;
import com.example.jyobiken.user.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
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
    public int insert(
            @Valid @RequestBody GroupCreateRequest request,
            Authentication authentication){
        return groupService.insert(request, authentication);
    }

    @PutMapping("/{id}")
    public int update(
            @PathVariable Long id,
            @Valid @RequestBody GroupUpdateRequest request,
            Authentication authentication){
        return groupService.update(id, request, authentication);
    }

    @PostMapping("/{id}/end")
    public int end(@PathVariable Long id, Authentication authentication){
        return groupService.end(id, authentication);
    }

    @DeleteMapping("/{id}")
    public int delete(@PathVariable Long id, Authentication authentication){
        return groupService.delete(id, authentication);
    }
}
