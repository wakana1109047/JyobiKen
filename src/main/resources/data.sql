-- Initial master data for PostgreSQL and H2 (PostgreSQL mode).
-- Run schema.sql before this file.
-- Match rows by their stable codes, not by generated identity values.
-- Re-running this file adds missing codes without resetting existing names
-- or re-enabling a reaction type that an administrator has disabled.

-- System-wide roles. Student stage (general/research/graduated) belongs in
-- users.student_stage; group roles (leader/member) belong in group_members.role.
INSERT INTO roles (code, name)
SELECT seed.code, seed.name
FROM (VALUES
    ('student', '学生'),
    ('admin', '管理者')
) AS seed (code, name)
WHERE NOT EXISTS (
    SELECT 1 FROM roles AS existing WHERE existing.code = seed.code
);

-- The reaction codes and display names specified in データ設計.xlsx.
-- Identity IDs are generated so existing IDs and foreign keys remain intact.
INSERT INTO reaction_types (code, name, is_active)
SELECT seed.code, seed.name, TRUE
FROM (VALUES
    ('like', 'いいね'),
    ('support', '支援'),
    ('inspire', 'HOT')
) AS seed (code, name)
WHERE NOT EXISTS (
    SELECT 1 FROM reaction_types AS existing WHERE existing.code = seed.code
);

-- No sample accounts, passwords, or business records are created here.
-- users, groups, group_members, projects, posts, comments,
-- post_reactions, project_reactions, tags, post_tags, project_tags,
-- files, bookmarks, and view_events start empty on a fresh database.
-- In particular, tags are created by an actual user/administrator:
-- no fixed managed-tag list is defined in the requirements, and
-- tags.created_by_user_id is a required foreign key.
-- The compatibility tables app_user, research_group, group_membership,
-- and admin_audit_log also receive no seed records.
-- Startup metadata is expressed by DEFAULT clauses in schema.sql,
-- rather than inserting dummy rows for every table.
