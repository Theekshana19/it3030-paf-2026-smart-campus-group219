-- this table stores comments added by users and staff on tickets
-- only the original author can edit their own comment
-- admin can delete any comment
IF OBJECT_ID(N'dbo.ticket_comments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_comments (
        comment_id BIGINT IDENTITY(1,1) NOT NULL,
        ticket_id BIGINT NOT NULL,
        author_email NVARCHAR(150) NOT NULL,
        author_name NVARCHAR(100) NOT NULL,
        comment_text NVARCHAR(2000) NOT NULL,
        is_edited BIT NOT NULL CONSTRAINT DF_ticket_comments_is_edited DEFAULT (0),
        is_active BIT NOT NULL CONSTRAINT DF_ticket_comments_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_ticket_comments_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_ticket_comments_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_ticket_comments PRIMARY KEY (comment_id),
        CONSTRAINT FK_ticket_comments_ticket FOREIGN KEY (ticket_id) REFERENCES dbo.tickets(ticket_id) ON DELETE CASCADE
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ticket_comments_ticket_id' AND object_id = OBJECT_ID(N'dbo.ticket_comments'))
    CREATE INDEX IX_ticket_comments_ticket_id ON dbo.ticket_comments(ticket_id);
GO
