IF OBJECT_ID(N'dbo.notifications', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.notifications (
        notification_id BIGINT IDENTITY(1,1) NOT NULL,
        user_id BIGINT NOT NULL,
        type NVARCHAR(30) NOT NULL,
        title NVARCHAR(150) NOT NULL,
        message NVARCHAR(1000) NOT NULL,
        is_read BIT NOT NULL CONSTRAINT DF_notifications_is_read DEFAULT (0),
        read_at DATETIME2(7) NULL,
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_notifications_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_notifications PRIMARY KEY (notification_id),
        CONSTRAINT FK_notifications_users
            FOREIGN KEY (user_id) REFERENCES dbo.users(user_id)
            ON DELETE CASCADE,
        CONSTRAINT CK_notifications_type
            CHECK (type IN (N'SYSTEM', N'RESOURCE', N'ROLE'))
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_notifications_user_id' AND object_id = OBJECT_ID(N'dbo.notifications'))
    CREATE INDEX IX_notifications_user_id ON dbo.notifications(user_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_notifications_created_at' AND object_id = OBJECT_ID(N'dbo.notifications'))
    CREATE INDEX IX_notifications_created_at ON dbo.notifications(created_at);
GO

