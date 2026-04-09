-- this table stores image attachments for incident tickets
-- each ticket can have maximum 3 images (enforced in service layer)
IF OBJECT_ID(N'dbo.ticket_attachments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_attachments (
        attachment_id BIGINT IDENTITY(1,1) NOT NULL,
        ticket_id BIGINT NOT NULL,
        file_name NVARCHAR(200) NOT NULL,
        stored_name NVARCHAR(300) NOT NULL,
        file_path NVARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        content_type NVARCHAR(100) NOT NULL,
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_ticket_attachments_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_ticket_attachments PRIMARY KEY (attachment_id),
        CONSTRAINT FK_ticket_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES dbo.tickets(ticket_id) ON DELETE CASCADE
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ticket_attachments_ticket_id' AND object_id = OBJECT_ID(N'dbo.ticket_attachments'))
    CREATE INDEX IX_ticket_attachments_ticket_id ON dbo.ticket_attachments(ticket_id);
GO
