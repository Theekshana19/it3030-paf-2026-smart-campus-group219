IF OBJECT_ID(N'dbo.resource_tag_mappings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.resource_tag_mappings (
        resource_tag_mapping_id BIGINT IDENTITY(1,1) NOT NULL,
        resource_id BIGINT NOT NULL,
        tag_id BIGINT NOT NULL,
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_resource_tag_mappings_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_resource_tag_mappings PRIMARY KEY (resource_tag_mapping_id),
        CONSTRAINT UQ_resource_tag_mappings_resource_tag UNIQUE (resource_id, tag_id),
        CONSTRAINT FK_resource_tag_mappings_resources
            FOREIGN KEY (resource_id) REFERENCES dbo.resources(resource_id)
            ON DELETE CASCADE,
        CONSTRAINT FK_resource_tag_mappings_resource_tags
            FOREIGN KEY (tag_id) REFERENCES dbo.resource_tags(tag_id)
            ON DELETE CASCADE
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resource_tag_mappings_resource_id' AND object_id = OBJECT_ID(N'dbo.resource_tag_mappings'))
    CREATE INDEX IX_resource_tag_mappings_resource_id ON dbo.resource_tag_mappings(resource_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resource_tag_mappings_tag_id' AND object_id = OBJECT_ID(N'dbo.resource_tag_mappings'))
    CREATE INDEX IX_resource_tag_mappings_tag_id ON dbo.resource_tag_mappings(tag_id);
GO
