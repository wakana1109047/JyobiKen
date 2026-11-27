package com.example.jyobiken.project.mapper;

import com.example.jyobiken.project.dto.ProjectResponse;
import com.example.jyobiken.project.entity.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project){

        return new ProjectResponse(
                    project.getId(),
                    project.getGroupId(),
                    project.getTitle(),
                    project.getSummary(),
                    project.getAcademicYear(),
                    project.getStatus());

    }
}
