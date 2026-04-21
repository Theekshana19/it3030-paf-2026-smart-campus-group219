CREATE TABLE IF NOT EXISTS ResourceStatusSchedules (
    ScheduleId BIGINT NOT NULL AUTO_INCREMENT,
    ResourceId BIGINT NOT NULL,
    ScheduleDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    ScheduledStatus VARCHAR(30) NOT NULL,
    ReasonNote VARCHAR(300) NULL,
    IsActive TINYINT(1) NOT NULL DEFAULT 1,
    CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UpdatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (ScheduleId),
    CONSTRAINT FK_resource_status_schedules_resources
        FOREIGN KEY (ResourceId) REFERENCES Resources (ResourceId)
        ON DELETE CASCADE,
    CONSTRAINT CK_resource_status_schedules_scheduled_status
        CHECK (ScheduledStatus IN ('ACTIVE', 'OUT_OF_SERVICE')),
    CONSTRAINT CK_resource_status_schedules_time_window
        CHECK (StartTime < EndTime)
);

CREATE INDEX IX_resource_status_schedules_resource_id ON ResourceStatusSchedules (ResourceId);
CREATE INDEX IX_resource_status_schedules_schedule_date ON ResourceStatusSchedules (ScheduleDate);
