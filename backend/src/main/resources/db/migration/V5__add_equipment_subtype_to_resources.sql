IF COL_LENGTH('dbo.resources', 'equipment_subtype') IS NULL
BEGIN
    ALTER TABLE dbo.resources
        ADD equipment_subtype NVARCHAR(80) NULL;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_resources_equipment_subtype'
      AND object_id = OBJECT_ID(N'dbo.resources')
)
BEGIN
    CREATE INDEX IX_resources_equipment_subtype
        ON dbo.resources(equipment_subtype);
END
GO

