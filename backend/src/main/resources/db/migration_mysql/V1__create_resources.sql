CREATE TABLE IF NOT EXISTS resources (
    resource_id BIGINT AUTO_INCREMENT NOT NULL,
    resource_code VARCHAR(50) NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    resource_type VARCHAR(30) NOT NULL,
    capacity INT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(30) NULL,
    room_or_area_identifier VARCHAR(80) NULL,
    full_location_description VARCHAR(300) NULL,
    default_available_from TIME NOT NULL,
    default_available_to TIME NOT NULL,
    working_days VARCHAR(120) NULL,
    status VARCHAR(30) NOT NULL,
    status_notes VARCHAR(300) NULL,
    description VARCHAR(1000) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (resource_id),
    UNIQUE KEY UQ_resources_resource_code (resource_code),
    CHECK (
        resource_type IN (
            'LECTURE_HALL',
            'LAB',
            'MEETING_ROOM',
            'EQUIPMENT'
        )
    ),
    CHECK (status IN ('ACTIVE', 'OUT_OF_SERVICE')),
    CHECK (
        capacity IS NULL
        OR capacity >= 0
    ),
    CHECK (default_available_from < default_available_to)
);
CREATE INDEX IF NOT EXISTS IX_resources_resource_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS IX_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS IX_resources_building ON resources(building);
CREATE INDEX IF NOT EXISTS IX_resources_resource_name ON resources(resource_name);
