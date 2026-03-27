IF OBJECT_ID(N'dbo.resource_tags', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.resource_tags (
        tag_id BIGINT IDENTITY(1,1) NOT NULL,
        tag_name NVARCHAR(80) NOT NULL,
        tag_color NVARCHAR(30) NULL,
        description NVARCHAR(300) NULL,
        is_active BIT NOT NULL CONSTRAINT DF_resource_tags_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_resource_tags_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_resource_tags_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_resource_tags PRIMARY KEY (tag_id),
        CONSTRAINT UQ_resource_tags_tag_name UNIQUE (tag_name)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resource_tags_tag_name' AND object_id = OBJECT_ID(N'dbo.resource_tags'))
    CREATE INDEX IX_resource_tags_tag_name ON dbo.resource_tags(tag_name);
GO
