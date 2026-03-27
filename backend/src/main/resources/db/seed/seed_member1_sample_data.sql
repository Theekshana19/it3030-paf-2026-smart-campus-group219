INSERT INTO dbo.Resources
(
    ResourceCode, ResourceName, ResourceType, Capacity, Building, Floor,
    RoomOrAreaIdentifier, FullLocationDescription, DefaultAvailableFrom, DefaultAvailableTo,
    WorkingDays, Status, StatusNotes, Description, IsActive, CreatedAt, UpdatedAt
)
VALUES
(
    N'LH-A1-101', N'Lecture Hall A1-101', N'LECTURE_HALL', 120, N'A1', N'1',
    N'101', N'Block A1, First Floor, Room 101', '08:00:00', '18:00:00',
    N'MON,TUE,WED,THU,FRI', N'ACTIVE', N'Operational', N'Main lecture hall', 1, SYSUTCDATETIME(), SYSUTCDATETIME()
),
(
    N'LAB-B2-01', N'Computer Lab B2-01', N'LAB', 40, N'B2', N'2',
    N'01', N'Block B2, Second Floor, Lab 01', '08:30:00', '17:30:00',
    N'MON,TUE,WED,THU,FRI', N'ACTIVE', N'Operational', N'Programming lab', 1, SYSUTCDATETIME(), SYSUTCDATETIME()
);
GO

INSERT INTO dbo.ResourceTags (TagName, TagColor, Description, IsActive, CreatedAt, UpdatedAt)
VALUES
(N'Projector', N'#2563EB', N'Has projector', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
(N'AC', N'#059669', N'Air conditioned', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
(N'Accessible', N'#7C3AED', N'Accessible for disabled users', 1, SYSUTCDATETIME(), SYSUTCDATETIME());
GO

DECLARE @ResourceId1 BIGINT = (SELECT ResourceId FROM dbo.Resources WHERE ResourceCode = N'LH-A1-101');
DECLARE @ResourceId2 BIGINT = (SELECT ResourceId FROM dbo.Resources WHERE ResourceCode = N'LAB-B2-01');
DECLARE @TagProjector BIGINT = (SELECT TagId FROM dbo.ResourceTags WHERE TagName = N'Projector');
DECLARE @TagAC BIGINT = (SELECT TagId FROM dbo.ResourceTags WHERE TagName = N'AC');
DECLARE @TagAccessible BIGINT = (SELECT TagId FROM dbo.ResourceTags WHERE TagName = N'Accessible');

INSERT INTO dbo.ResourceTagMappings (ResourceId, TagId, CreatedAt)
VALUES
(@ResourceId1, @TagProjector, SYSUTCDATETIME()),
(@ResourceId1, @TagAC, SYSUTCDATETIME()),
(@ResourceId2, @TagProjector, SYSUTCDATETIME()),
(@ResourceId2, @TagAccessible, SYSUTCDATETIME());
GO

INSERT INTO dbo.ResourceStatusSchedules
(
    ResourceId, ScheduleDate, StartTime, EndTime, ScheduledStatus, ReasonNote,
    IsActive, CreatedAt, UpdatedAt
)
VALUES
(@ResourceId1, CAST(GETUTCDATE() AS DATE), '10:00:00', '12:00:00', N'OUT_OF_SERVICE', N'AV system maintenance', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
(@ResourceId2, DATEADD(DAY, 1, CAST(GETUTCDATE() AS DATE)), '13:00:00', '16:00:00', N'OUT_OF_SERVICE', N'Network upgrade', 1, SYSUTCDATETIME(), SYSUTCDATETIME());
GO
