BEGIN;

CREATE TABLE IF NOT EXISTS production_enrollments (
    user_id         BIGINT NOT NULL,
    academic_year   INTEGER NOT NULL,
    semester        INTEGER NOT NULL CHECK (semester IN (1, 2)),
    is_enrolled     BOOLEAN NOT NULL,
    answered_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, academic_year, semester),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

COMMIT;