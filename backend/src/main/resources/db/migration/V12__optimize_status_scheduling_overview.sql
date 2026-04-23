IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_resource_status_schedules_status_date'
      AND object_id = OBJECT_ID(N'dbo.resource_status_schedules')
)
    CREATE INDEX IX_resource_status_schedules_status_date
        ON dbo.resource_status_schedules(scheduled_status, schedule_date, start_time);
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_resource_status_schedules_updated_at'
      AND object_id = OBJECT_ID(N'dbo.resource_status_schedules')
)
    CREATE INDEX IX_resource_status_schedules_updated_at
        ON dbo.resource_status_schedules(updated_at DESC);
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_resources_type_building'
      AND object_id = OBJECT_ID(N'dbo.resources')
)
    CREATE INDEX IX_resources_type_building
        ON dbo.resources(resource_type, building);
GO
