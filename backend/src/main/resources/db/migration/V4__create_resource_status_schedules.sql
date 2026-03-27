IF OBJECT_ID(N'dbo.resource_status_schedules', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.resource_status_schedules (
        schedule_id BIGINT IDENTITY(1,1) NOT NULL,
        resource_id BIGINT NOT NULL,
        schedule_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        scheduled_status NVARCHAR(30) NOT NULL,
        reason_note NVARCHAR(300) NULL,
        is_active BIT NOT NULL CONSTRAINT DF_resource_status_schedules_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_resource_status_schedules_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_resource_status_schedules_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_resource_status_schedules PRIMARY KEY (schedule_id),
        CONSTRAINT FK_resource_status_schedules_resources
            FOREIGN KEY (resource_id) REFERENCES dbo.resources(resource_id)
            ON DELETE CASCADE,
        CONSTRAINT CK_resource_status_schedules_scheduled_status
            CHECK (scheduled_status IN (N'ACTIVE', N'OUT_OF_SERVICE')),
        CONSTRAINT CK_resource_status_schedules_time_window
            CHECK (start_time < end_time)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resource_status_schedules_resource_id' AND object_id = OBJECT_ID(N'dbo.resource_status_schedules'))
    CREATE INDEX IX_resource_status_schedules_resource_id ON dbo.resource_status_schedules(resource_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resource_status_schedules_schedule_date' AND object_id = OBJECT_ID(N'dbo.resource_status_schedules'))
    CREATE INDEX IX_resource_status_schedules_schedule_date ON dbo.resource_status_schedules(schedule_date);
GO
