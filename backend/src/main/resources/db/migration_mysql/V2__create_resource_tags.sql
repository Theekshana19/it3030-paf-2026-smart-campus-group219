CREATE TABLE IF NOT EXISTS resource_tags (
    tag_id BIGINT AUTO_INCREMENT NOT NULL,
    tag_name VARCHAR(80) NOT NULL,
    tag_color VARCHAR(30) NULL,
    description VARCHAR(300) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (tag_id),
    UNIQUE KEY UQ_resource_tags_tag_name (tag_name)
);
CREATE INDEX IF NOT EXISTS IX_resource_tags_tag_name ON resource_tags(tag_name);
