-- Drop and re-create the CHECK constraint to include BOOKING and TICKET types
IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name = N'CK_notifications_type'
      AND parent_object_id = OBJECT_ID(N'dbo.notifications')
)
BEGIN
    ALTER TABLE dbo.notifications DROP CONSTRAINT CK_notifications_type;
END
GO

ALTER TABLE dbo.notifications
    ADD CONSTRAINT CK_notifications_type
    CHECK (type IN (N'SYSTEM', N'RESOURCE', N'ROLE', N'BOOKING', N'TICKET'));
GO
