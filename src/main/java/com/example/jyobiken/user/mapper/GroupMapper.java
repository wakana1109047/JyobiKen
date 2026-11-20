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


    @Insert("""
    INSERT INTO research_group
    (
        name,
        description,
        status,
        created_by
    )
    VALUES
    (
        #{name},
        #{description},
        #{status},
        #{createdBy}
    )
""")
    int insert(Group group);


    @Update("""
    UPDATE research_group
    SET
        name = #{name},
        description = #{description},
        status = #{status},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = #{id}
""")
    int update(Group group);



    @Delete("""
    DELETE FROM research_group
    WHERE id = #{id}
""")
    int delete(Long id);
}