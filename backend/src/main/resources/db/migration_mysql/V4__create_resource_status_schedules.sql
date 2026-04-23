CREATE TABLE IF NOT EXISTS resource_status_schedules (
    schedule_id BIGINT AUTO_INCREMENT NOT NULL,
    resource_id BIGINT NOT NULL,
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    scheduled_status VARCHAR(30) NOT NULL,
    reason_note VARCHAR(300) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (schedule_id),
    CONSTRAINT FK_resource_status_schedules_resources FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE,
    CHECK (scheduled_status IN ('ACTIVE', 'OUT_OF_SERVICE')),
    CHECK (start_time < end_time)
);
CREATE INDEX IF NOT EXISTS IX_resource_status_schedules_resource_id ON resource_status_schedules(resource_id);
CREATE INDEX IF NOT EXISTS IX_resource_status_schedules_schedule_date ON resource_status_schedules(schedule_date);
