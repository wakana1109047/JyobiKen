package com.example.jyobiken.project.service;

import com.example.jyobiken.project.dto.ProjectResponse;
import com.example.jyobiken.project.entity.Project;
import com.example.jyobiken.project.mapper.ProjectMapper;
import com.example.jyobiken.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public List<ProjectResponse> getAllProjects(){
        List<Project> projects = projectRepository.findAll();
        List<ProjectResponse> pResponses = new ArrayList<>();

        for(Project project : projects){
            ProjectResponse response = projectMapper.toResponse(project);
            pResponses.add(response);
        }

        return pResponses;
    }

}
