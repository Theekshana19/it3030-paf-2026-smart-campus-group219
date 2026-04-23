-- tickets table for maintenance and incident tracking
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id BIGINT AUTO_INCREMENT NOT NULL,
    ticket_ref VARCHAR(30) NOT NULL,
    resource_id BIGINT NULL,
    location_desc VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    reporter_email VARCHAR(150) NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NULL,
    contact_method VARCHAR(30) NULL,
    ticket_status VARCHAR(20) NOT NULL,
    assigned_to_email VARCHAR(150) NULL,
    assigned_to_name VARCHAR(100) NULL,
    assigned_at DATETIME(6) NULL,
    resolution_notes VARCHAR(2000) NULL,
    resolved_at DATETIME(6) NULL,
    closed_at DATETIME(6) NULL,
    reject_reason VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (ticket_id),
    UNIQUE KEY UQ_tickets_ticket_ref (ticket_ref),
    CONSTRAINT FK_tickets_resource FOREIGN KEY (resource_id) REFERENCES resources(resource_id),
    CHECK (
        ticket_status IN (
            'OPEN',
            'IN_PROGRESS',
            'RESOLVED',
            'CLOSED',
            'REJECTED'
        )
    ),
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CHECK (
        category IN (
            'ELECTRICAL',
            'PLUMBING',
            'IT_EQUIPMENT',
            'FURNITURE',
            'HVAC',
            'CLEANING',
            'OTHER'
        )
    )
);
CREATE INDEX IF NOT EXISTS IX_tickets_resource_id ON tickets(resource_id);
CREATE INDEX IF NOT EXISTS IX_tickets_ticket_status ON tickets(ticket_status);
CREATE INDEX IF NOT EXISTS IX_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS IX_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS IX_tickets_reporter_email ON tickets(reporter_email);
