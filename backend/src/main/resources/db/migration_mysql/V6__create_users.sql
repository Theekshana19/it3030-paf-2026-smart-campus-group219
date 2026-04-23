CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT NOT NULL,
    google_sub VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    profile_image_url VARCHAR(500) NULL,
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (user_id),
    UNIQUE KEY UQ_users_google_sub (google_sub),
    UNIQUE KEY UQ_users_email (email),
    CHECK (role IN ('USER', 'ADMIN', 'TECHNICIAN'))
);
CREATE INDEX IF NOT EXISTS IX_users_email ON users(email);
