CREATE TABLE IF NOT EXISTS resource_tag_mappings (
    resource_tag_mapping_id BIGINT AUTO_INCREMENT NOT NULL,
    resource_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (resource_tag_mapping_id),
    UNIQUE KEY UQ_resource_tag_mappings_resource_tag (resource_id, tag_id),
    CONSTRAINT FK_resource_tag_mappings_resources FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE,
    CONSTRAINT FK_resource_tag_mappings_resource_tags FOREIGN KEY (tag_id) REFERENCES resource_tags(tag_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS IX_resource_tag_mappings_resource_id ON resource_tag_mappings(resource_id);
CREATE INDEX IF NOT EXISTS IX_resource_tag_mappings_tag_id ON resource_tag_mappings(tag_id);
