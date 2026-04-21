CREATE TABLE IF NOT EXISTS ResourceTagMappings (
    ResourceTagMappingId BIGINT NOT NULL AUTO_INCREMENT,
    ResourceId BIGINT NOT NULL,
    TagId BIGINT NOT NULL,
    CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (ResourceTagMappingId),
    CONSTRAINT UQ_resource_tag_mappings_resource_tag UNIQUE (ResourceId, TagId),
    CONSTRAINT FK_resource_tag_mappings_resources
        FOREIGN KEY (ResourceId) REFERENCES Resources (ResourceId)
        ON DELETE CASCADE,
    CONSTRAINT FK_resource_tag_mappings_resource_tags
        FOREIGN KEY (TagId) REFERENCES ResourceTags (TagId)
        ON DELETE CASCADE
);

CREATE INDEX IX_resource_tag_mappings_resource_id ON ResourceTagMappings (ResourceId);
CREATE INDEX IX_resource_tag_mappings_tag_id ON ResourceTagMappings (TagId);
