package com.example.jyobiken.project.controller;

import com.example.jyobiken.project.dto.ProjectResponse;
import com.example.jyobiken.project.service.ProjectService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService pService;

    public ProjectController(ProjectService pService) {
        this.pService = pService;
    }

    @GetMapping
    public List<ProjectResponse> getAllProjects(){
        return pService.getAllProjects();
    }
}
