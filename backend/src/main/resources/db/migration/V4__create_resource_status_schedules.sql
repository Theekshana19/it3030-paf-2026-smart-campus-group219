IF OBJECT_ID(N'dbo.ResourceStatusSchedules', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ResourceStatusSchedules (
        ScheduleId BIGINT IDENTITY(1,1) NOT NULL,
        ResourceId BIGINT NOT NULL,
        ScheduleDate DATE NOT NULL,
        StartTime TIME NOT NULL,
        EndTime TIME NOT NULL,
        ScheduledStatus NVARCHAR(30) NOT NULL,
        ReasonNote NVARCHAR(300) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_ResourceStatusSchedules_IsActive DEFAULT (1),
        CreatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_ResourceStatusSchedules_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_ResourceStatusSchedules_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_ResourceStatusSchedules PRIMARY KEY (ScheduleId),
        CONSTRAINT FK_ResourceStatusSchedules_Resources
            FOREIGN KEY (ResourceId) REFERENCES dbo.Resources(ResourceId)
            ON DELETE CASCADE,
        CONSTRAINT CK_ResourceStatusSchedules_ScheduledStatus
            CHECK (ScheduledStatus IN (N'ACTIVE', N'OUT_OF_SERVICE')),
        CONSTRAINT CK_ResourceStatusSchedules_TimeWindow
            CHECK (StartTime < EndTime)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ResourceStatusSchedules_ResourceId' AND object_id = OBJECT_ID(N'dbo.ResourceStatusSchedules'))
    CREATE INDEX IX_ResourceStatusSchedules_ResourceId ON dbo.ResourceStatusSchedules(ResourceId);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ResourceStatusSchedules_ScheduleDate' AND object_id = OBJECT_ID(N'dbo.ResourceStatusSchedules'))
    CREATE INDEX IX_ResourceStatusSchedules_ScheduleDate ON dbo.ResourceStatusSchedules(ScheduleDate);
GO
