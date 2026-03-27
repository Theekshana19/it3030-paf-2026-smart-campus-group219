IF OBJECT_ID(N'dbo.Resources', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Resources (
        ResourceId BIGINT IDENTITY(1,1) NOT NULL,
        ResourceCode NVARCHAR(50) NOT NULL,
        ResourceName NVARCHAR(150) NOT NULL,
        ResourceType NVARCHAR(30) NOT NULL,
        Capacity INT NULL,
        Building NVARCHAR(100) NOT NULL,
        Floor NVARCHAR(30) NULL,
        RoomOrAreaIdentifier NVARCHAR(80) NULL,
        FullLocationDescription NVARCHAR(300) NULL,
        DefaultAvailableFrom TIME NOT NULL,
        DefaultAvailableTo TIME NOT NULL,
        WorkingDays NVARCHAR(120) NULL,
        Status NVARCHAR(30) NOT NULL,
        StatusNotes NVARCHAR(300) NULL,
        Description NVARCHAR(1000) NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_Resources_IsActive DEFAULT (1),
        CreatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_Resources_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt DATETIME2(7) NOT NULL CONSTRAINT DF_Resources_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_Resources PRIMARY KEY (ResourceId),
        CONSTRAINT UQ_Resources_ResourceCode UNIQUE (ResourceCode),
        CONSTRAINT CK_Resources_ResourceType
            CHECK (ResourceType IN (N'LECTURE_HALL', N'LAB', N'MEETING_ROOM', N'EQUIPMENT')),
        CONSTRAINT CK_Resources_Status
            CHECK (Status IN (N'ACTIVE', N'OUT_OF_SERVICE')),
        CONSTRAINT CK_Resources_Capacity
            CHECK (Capacity IS NULL OR Capacity >= 0),
        CONSTRAINT CK_Resources_AvailabilityWindow
            CHECK (DefaultAvailableFrom < DefaultAvailableTo)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Resources_ResourceType' AND object_id = OBJECT_ID(N'dbo.Resources'))
    CREATE INDEX IX_Resources_ResourceType ON dbo.Resources(ResourceType);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Resources_Status' AND object_id = OBJECT_ID(N'dbo.Resources'))
    CREATE INDEX IX_Resources_Status ON dbo.Resources(Status);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Resources_Building' AND object_id = OBJECT_ID(N'dbo.Resources'))
    CREATE INDEX IX_Resources_Building ON dbo.Resources(Building);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Resources_ResourceName' AND object_id = OBJECT_ID(N'dbo.Resources'))
    CREATE INDEX IX_Resources_ResourceName ON dbo.Resources(ResourceName);
GO
