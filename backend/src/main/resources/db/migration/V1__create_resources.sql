IF OBJECT_ID(N'dbo.resources', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.resources (
        resource_id BIGINT IDENTITY(1,1) NOT NULL,
        resource_code NVARCHAR(50) NOT NULL,
        resource_name NVARCHAR(150) NOT NULL,
        resource_type NVARCHAR(30) NOT NULL,
        capacity INT NULL,
        building NVARCHAR(100) NOT NULL,
        floor NVARCHAR(30) NULL,
        room_or_area_identifier NVARCHAR(80) NULL,
        full_location_description NVARCHAR(300) NULL,
        default_available_from TIME NOT NULL,
        default_available_to TIME NOT NULL,
        working_days NVARCHAR(120) NULL,
        status NVARCHAR(30) NOT NULL,
        status_notes NVARCHAR(300) NULL,
        description NVARCHAR(1000) NULL,
        is_active BIT NOT NULL CONSTRAINT DF_resources_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_resources_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_resources_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_resources PRIMARY KEY (resource_id),
        CONSTRAINT UQ_resources_resource_code UNIQUE (resource_code),
        CONSTRAINT CK_resources_resource_type
            CHECK (resource_type IN (N'LECTURE_HALL', N'LAB', N'MEETING_ROOM', N'EQUIPMENT')),
        CONSTRAINT CK_resources_status
            CHECK (status IN (N'ACTIVE', N'OUT_OF_SERVICE')),
        CONSTRAINT CK_resources_capacity
            CHECK (capacity IS NULL OR capacity >= 0),
        CONSTRAINT CK_resources_availability_window
            CHECK (default_available_from < default_available_to)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resources_resource_type' AND object_id = OBJECT_ID(N'dbo.resources'))
    CREATE INDEX IX_resources_resource_type ON dbo.resources(resource_type);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resources_status' AND object_id = OBJECT_ID(N'dbo.resources'))
    CREATE INDEX IX_resources_status ON dbo.resources(status);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resources_building' AND object_id = OBJECT_ID(N'dbo.resources'))
    CREATE INDEX IX_resources_building ON dbo.resources(building);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_resources_resource_name' AND object_id = OBJECT_ID(N'dbo.resources'))
    CREATE INDEX IX_resources_resource_name ON dbo.resources(resource_name);
GO
