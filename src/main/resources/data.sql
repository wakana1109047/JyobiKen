INSERT INTO roles (code, name)
SELECT 'GENERAL_STUDENT', '一般生'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE code = 'GENERAL_STUDENT');

INSERT INTO roles (code, name)
SELECT 'RESEARCH_STUDENT', '卒研生'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE code = 'RESEARCH_STUDENT');

INSERT INTO roles (code, name)
SELECT 'ALUMNI', '既卒者'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE code = 'ALUMNI');

INSERT INTO roles (code, name)
SELECT 'ADMIN', '管理者'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE code = 'ADMIN');

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
