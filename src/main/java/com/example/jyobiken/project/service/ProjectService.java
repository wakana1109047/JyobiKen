package com.example.jyobiken.project.service;

import com.example.jyobiken.project.dto.ProjectResponse;
import com.example.jyobiken.project.entity.Project;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllProjects();
}
