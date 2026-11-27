package com.example.jyobiken.user.mapper;

import com.example.jyobiken.user.entity.Post;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface PostMapper {

    @Select("""
        SELECT
            id,
            project_id AS projectId,
            created_by_user_id AS createdByUserId,
            content,
            status,
            version,
            published_at AS publishedAt,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM posts
        ORDER BY id
    """)
    List<Post> findAll();

    @Select("""
        SELECT
            id,
            project_id AS projectId,
            created_by_user_id AS createdByUserId,
            content,
            status,
            version,
            published_at AS publishedAt,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM posts
        WHERE id = #{id}
    """)
    Post findById(Long id);

    @Insert("""
        INSERT INTO posts
        (
            project_id,
            created_by_user_id,
            content,
            status
        )
        VALUES
        (
            #{projectId},
            #{createdByUserId},
            #{content},
            #{status}
        )
    """)
    int insert(Post post);

    @Update("""
        UPDATE posts
        SET
            content = #{content},
            status = #{status},
            version = version + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
    """)
    int update(Post post);

    @Delete("""
        DELETE FROM posts
        WHERE id = #{id}
    """)
    int delete(Long id);
}
