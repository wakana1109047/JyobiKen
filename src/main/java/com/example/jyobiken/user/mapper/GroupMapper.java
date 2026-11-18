package com.example.jyobiken.user.mapper;

import com.example.jyobiken.user.entity.Group;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface GroupMapper {

    @Select("""
        SELECT
            id,
            name,
            description,
            status,
            created_by AS createdBy,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM research_group
        ORDER BY id
    """)
    List<Group> findAll();

}