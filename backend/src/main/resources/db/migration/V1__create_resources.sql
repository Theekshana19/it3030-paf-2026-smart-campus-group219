CREATE TABLE IF NOT EXISTS Resources (
    ResourceId BIGINT NOT NULL AUTO_INCREMENT,
    ResourceCode VARCHAR(50) NOT NULL,
    ResourceName VARCHAR(150) NOT NULL,
    ResourceType VARCHAR(30) NOT NULL,
    Capacity INT NULL,
    Building VARCHAR(100) NOT NULL,
    Floor VARCHAR(30) NULL,
    RoomOrAreaIdentifier VARCHAR(80) NULL,
    FullLocationDescription VARCHAR(300) NULL,
    DefaultAvailableFrom TIME NOT NULL,
    DefaultAvailableTo TIME NOT NULL,
    WorkingDays VARCHAR(120) NULL,
    Status VARCHAR(30) NOT NULL,
    StatusNotes VARCHAR(300) NULL,
    Description VARCHAR(1000) NULL,
    IsActive TINYINT(1) NOT NULL DEFAULT 1,
    CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UpdatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (ResourceId),
    CONSTRAINT UQ_resources_resource_code UNIQUE (ResourceCode),
    CONSTRAINT CK_resources_resource_type CHECK (ResourceType IN ('LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT')),
    CONSTRAINT CK_resources_status CHECK (Status IN ('ACTIVE', 'OUT_OF_SERVICE')),
    CONSTRAINT CK_resources_capacity CHECK (Capacity IS NULL OR Capacity >= 0),
    CONSTRAINT CK_resources_availability_window CHECK (DefaultAvailableFrom < DefaultAvailableTo)
);

CREATE INDEX IX_resources_resource_type ON Resources (ResourceType);
CREATE INDEX IX_resources_status ON Resources (Status);
CREATE INDEX IX_resources_building ON Resources (Building);
CREATE INDEX IX_resources_resource_name ON Resources (ResourceName);
