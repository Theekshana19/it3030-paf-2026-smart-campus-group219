IF OBJECT_ID(N'dbo.ResourceTags', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ResourceTags (
        TagId BIGINT IDENTITY(1,1) NOT NULL,
        TagName NVARCHAR(80) NOT NULL,
        TagColor NVARCHAR(30) NULL,
        Description NVARCHAR(300) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_ResourceTags_IsActive DEFAULT (1),
        CreatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_ResourceTags_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_ResourceTags_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_ResourceTags PRIMARY KEY (TagId),
        CONSTRAINT UQ_ResourceTags_TagName UNIQUE (TagName)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ResourceTags_TagName' AND object_id = OBJECT_ID(N'dbo.ResourceTags'))
    CREATE INDEX IX_ResourceTags_TagName ON dbo.ResourceTags(TagName);
GO
