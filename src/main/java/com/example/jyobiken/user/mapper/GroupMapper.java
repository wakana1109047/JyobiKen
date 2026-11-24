package com.example.jyobiken.user.mapper;

import com.example.jyobiken.user.entity.Group;
import org.apache.ibatis.annotations.*;

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
        WHERE LOWER(status) <> 'deleted'
        ORDER BY id
    """)
    List<Group> findAll();


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
          WHERE id = #{id}
""")
    Group findById(Long id);

    @Select("""
        SELECT id
        FROM research_group
        WHERE id = #{id}
        FOR UPDATE
    """)
    Long lockById(@Param("id") Long id);


    @Insert("""
        INSERT INTO research_group (name, description, status, created_by)
        VALUES (#{name}, #{description}, 'active', #{createdBy})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Group group);


    @Update("""
        UPDATE research_group
        SET name = #{name},
            description = #{description},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
          AND LOWER(status) <> 'deleted'
    """)
    int update(Group group);

    @Update("""
        UPDATE research_group
        SET status = #{status},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
          AND LOWER(status) <> 'deleted'
    """)
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}