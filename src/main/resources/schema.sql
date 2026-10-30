CREATE TABLE IF NOT EXISTS  roles(
       code                 VARCHAR(20) PRIMARY KEY,
       name                 VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
       id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       name                 VARCHAR(50) NOT NULL,
       email                VARCHAR(255) NOT NULL UNIQUE,
       recovery_email       VARCHAR(255),
       password_hash        VARCHAR(255) NOT NULL,
       student_stage        VARCHAR(20),
       role                 VARCHAR(20) NOT NULL DEFAULT 'student',
       department           VARCHAR(50) NOT NULL,
       status               VARCHAR(50) NOT NULL DEFAULT 'active',

       FOREIGN KEY (role) REFERENCES roles(code)
       );