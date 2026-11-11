INSERT INTO roles (code, name)
SELECT seed.code, seed.name
FROM (VALUES
    ('student', '学生'),
    ('admin', '管理者')
) AS seed (code, name)
WHERE NOT EXISTS (
    SELECT 1 FROM roles AS existing WHERE existing.code = seed.code
);

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
