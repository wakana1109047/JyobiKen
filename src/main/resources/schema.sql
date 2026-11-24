CREATE TABLE IF NOT EXISTS roles(
    code                 VARCHAR(20) PRIMARY KEY,
    name                 VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 VARCHAR(50) NOT NULL,
    email                VARCHAR(255) NOT NULL UNIQUE,
    recovery_email       VARCHAR(255),
    password_hash        VARCHAR(255) NOT NULL,
    student_stage        VARCHAR(20) DEFAULT 'general',
    role                 VARCHAR(20) NOT NULL DEFAULT 'student',
    department           VARCHAR(50) NOT NULL,
    status               VARCHAR(50) NOT NULL DEFAULT 'active',

    FOREIGN KEY (role) REFERENCES roles(code)
);

CREATE TABLE IF NOT EXISTS groups(
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 VARCHAR(50) NOT NULL,
    description          TEXT,
    status               VARCHAR(20) NOT NULL DEFAULT 'active',
    created_by           BIGINT NOT NULL,
    is_recruiting        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS group_members(
    group_id             BIGINT NOT NULL,
    user_id              BIGINT NOT NULL,
    role                 VARCHAR(20) NOT NULL DEFAULT 'member',
    joined_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS projects(
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id             BIGINT NOT NULL UNIQUE,
    title                VARCHAR(255) NOT NULL,
    summary              TEXT,
    academic_year        INTEGER NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'planning',
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at         TIMESTAMP,

    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS posts(
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id           BIGINT NOT NULL,
    created_by_user_id   BIGINT NOT NULL,
    content              TEXT NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'draft',
    version              INTEGER NOT NULL DEFAULT 0,
    published_at         TIMESTAMP,
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments(
  id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id                BIGINT NOT NULL,
  created_by_user_id     BIGINT NOT NULL,
  parent_comment_id      BIGINT,
  content                VARCHAR(500) NOT NULL,
  status                 VARCHAR(20) NOT NULL DEFAULT 'published',
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(created_by_user_id) REFERENCES users(id),
    FOREIGN KEY(parent_comment_id) REFERENCES comments(id)
);

CREATE TABLE IF NOT EXISTS reaction_types(
  id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code                   VARCHAR(20) NOT NULL UNIQUE,
  name                   VARCHAR(50) NOT NULL,
  is_active              BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS post_reactions(
  post_id                BIGINT NOT NULL,
  user_id                BIGINT NOT NULL,
  reaction_type_id       BIGINT NOT NULL,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(post_id, user_id, reaction_type_id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(reaction_type_id) REFERENCES reaction_types(id)
);

CREATE TABLE IF NOT EXISTS project_reactions(
  project_id             BIGINT NOT NULL,
  user_id                BIGINT NOT NULL,
  reaction_type_id       BIGINT NOT NULL,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(project_id, user_id, reaction_type_id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(reaction_type_id) REFERENCES reaction_types(id)
);

CREATE TABLE IF NOT EXISTS tags(
  id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name                   VARCHAR(10) NOT NULL UNIQUE,
  tag_type               VARCHAR(20) NOT NULL DEFAULT 'hashtag',
  created_by_user_id     BIGINT NOT NULL,
  is_active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_tags(
  project_id             BIGINT NOT NULL,
  tag_id                 BIGINT NOT NULL,

  PRIMARY KEY(project_id, tag_id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS post_tags(
  post_id                BIGINT NOT NULL,
  tag_id                 BIGINT NOT NULL,

  PRIMARY KEY(post_id, tag_id),
  FOREIGN KEY(post_id) REFERENCES posts(id),
  FOREIGN KEY(tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS files(
  id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id             BIGINT NOT NULL,
  post_id                BIGINT,
  uploaded_by_user_id    BIGINT NOT NULL,
  file_purpose           VARCHAR(20) NOT NULL DEFAULT 'post',
  original_name          VARCHAR(50) NOT NULL,
  sizes_bytes            BIGINT NOT NULL,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(post_id) REFERENCES posts(id),
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookmarks(
  user_id                BIGINT NOT NULL,
  project_id             BIGINT NOT NULL,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(user_id, project_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS view_events(
  id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id             BIGINT NOT NULL,
  viewer_user_id         BIGINT NOT NULL,
  viewed_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(viewer_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS app_user (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_type VARCHAR(32) NOT NULL DEFAULT 'GENERAL_STUDENT'
        CHECK (user_type IN ('GENERAL_STUDENT', 'RESEARCH_STUDENT', 'ALUMNI', 'ADMIN')),
    account_status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE'
        CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'EXPIRED')),
    expires_at DATE
);

ALTER TABLE app_user
    ADD COLUMN IF NOT EXISTS user_type VARCHAR(32) NOT NULL DEFAULT 'GENERAL_STUDENT';
ALTER TABLE app_user
    ADD COLUMN IF NOT EXISTS account_status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE app_user
    ADD COLUMN IF NOT EXISTS expires_at DATE;

CREATE TABLE IF NOT EXISTS research_group (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_membership (
    group_id BIGINT NOT NULL REFERENCES research_group(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    group_role VARCHAR(16) NOT NULL DEFAULT 'MEMBER'
        CHECK (group_role IN ('LEADER', 'MEMBER')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(64) NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id BIGINT,
    details VARCHAR(2000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
