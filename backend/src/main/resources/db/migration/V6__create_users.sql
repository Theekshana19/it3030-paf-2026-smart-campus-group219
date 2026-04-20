IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        user_id BIGINT IDENTITY(1,1) NOT NULL,
        google_sub NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        display_name NVARCHAR(150) NOT NULL,
        profile_image_url NVARCHAR(500) NULL,
        role NVARCHAR(30) NOT NULL,
        is_active BIT NOT NULL CONSTRAINT DF_users_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_users_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_users_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_users PRIMARY KEY (user_id),
        CONSTRAINT UQ_users_google_sub UNIQUE (google_sub),
        CONSTRAINT UQ_users_email UNIQUE (email),
        CONSTRAINT CK_users_role
            CHECK (role IN (N'USER', N'ADMIN', N'TECHNICIAN'))
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_users_email' AND object_id = OBJECT_ID(N'dbo.users'))
    CREATE INDEX IX_users_email ON dbo.users(email);
GO

