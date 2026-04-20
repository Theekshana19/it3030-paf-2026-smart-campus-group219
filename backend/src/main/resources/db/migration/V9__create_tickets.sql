-- tickets table for maintenance and incident tracking
IF OBJECT_ID(N'dbo.tickets', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.tickets (
        ticket_id BIGINT IDENTITY(1,1) NOT NULL,
        ticket_ref NVARCHAR(30) NOT NULL,
        resource_id BIGINT NULL,
        location_desc NVARCHAR(200) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        title NVARCHAR(200) NOT NULL,
        description NVARCHAR(2000) NOT NULL,
        priority NVARCHAR(20) NOT NULL,
        reporter_email NVARCHAR(150) NOT NULL,
        reporter_name NVARCHAR(100) NOT NULL,
        contact_phone NVARCHAR(20) NULL,
        contact_method NVARCHAR(30) NULL,
        ticket_status NVARCHAR(20) NOT NULL,
        assigned_to_email NVARCHAR(150) NULL,
        assigned_to_name NVARCHAR(100) NULL,
        assigned_at DATETIME2(7) NULL,
        resolution_notes NVARCHAR(2000) NULL,
        resolved_at DATETIME2(7) NULL,
        closed_at DATETIME2(7) NULL,
        reject_reason NVARCHAR(500) NULL,
        is_active BIT NOT NULL CONSTRAINT DF_tickets_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_tickets_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_tickets_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_tickets PRIMARY KEY (ticket_id),
        CONSTRAINT UQ_tickets_ticket_ref UNIQUE (ticket_ref),
        CONSTRAINT FK_tickets_resource FOREIGN KEY (resource_id) REFERENCES dbo.resources(resource_id),
        CONSTRAINT CK_tickets_status
            CHECK (ticket_status IN (N'OPEN', N'IN_PROGRESS', N'RESOLVED', N'CLOSED', N'REJECTED')),
        CONSTRAINT CK_tickets_priority
            CHECK (priority IN (N'LOW', N'MEDIUM', N'HIGH', N'URGENT')),
        CONSTRAINT CK_tickets_category
            CHECK (category IN (N'ELECTRICAL', N'PLUMBING', N'IT_EQUIPMENT', N'FURNITURE', N'HVAC', N'CLEANING', N'OTHER'))
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_tickets_resource_id' AND object_id = OBJECT_ID(N'dbo.tickets'))
    CREATE INDEX IX_tickets_resource_id ON dbo.tickets(resource_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_tickets_ticket_status' AND object_id = OBJECT_ID(N'dbo.tickets'))
    CREATE INDEX IX_tickets_ticket_status ON dbo.tickets(ticket_status);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_tickets_priority' AND object_id = OBJECT_ID(N'dbo.tickets'))
    CREATE INDEX IX_tickets_priority ON dbo.tickets(priority);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_tickets_category' AND object_id = OBJECT_ID(N'dbo.tickets'))
    CREATE INDEX IX_tickets_category ON dbo.tickets(category);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_tickets_reporter_email' AND object_id = OBJECT_ID(N'dbo.tickets'))
    CREATE INDEX IX_tickets_reporter_email ON dbo.tickets(reporter_email);
GO
