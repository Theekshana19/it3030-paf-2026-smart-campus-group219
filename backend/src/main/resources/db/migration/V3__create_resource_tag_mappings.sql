IF OBJECT_ID(N'dbo.ResourceTagMappings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ResourceTagMappings (
        ResourceTagMappingId BIGINT IDENTITY(1,1) NOT NULL,
        ResourceId BIGINT NOT NULL,
        TagId BIGINT NOT NULL,
        CreatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_ResourceTagMappings_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_ResourceTagMappings PRIMARY KEY (ResourceTagMappingId),
        CONSTRAINT UQ_ResourceTagMappings_Resource_Tag UNIQUE (ResourceId, TagId),
        CONSTRAINT FK_ResourceTagMappings_Resources
            FOREIGN KEY (ResourceId) REFERENCES dbo.Resources(ResourceId)
            ON DELETE CASCADE,
        CONSTRAINT FK_ResourceTagMappings_ResourceTags
            FOREIGN KEY (TagId) REFERENCES dbo.ResourceTags(TagId)
            ON DELETE CASCADE
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ResourceTagMappings_ResourceId' AND object_id = OBJECT_ID(N'dbo.ResourceTagMappings'))
    CREATE INDEX IX_ResourceTagMappings_ResourceId ON dbo.ResourceTagMappings(ResourceId);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ResourceTagMappings_TagId' AND object_id = OBJECT_ID(N'dbo.ResourceTagMappings'))
    CREATE INDEX IX_ResourceTagMappings_TagId ON dbo.ResourceTagMappings(TagId);
GO
