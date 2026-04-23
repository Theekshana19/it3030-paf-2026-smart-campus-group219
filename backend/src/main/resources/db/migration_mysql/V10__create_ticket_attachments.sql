-- this table stores image attachments for incident tickets
-- each ticket can have maximum 3 images (enforced in service layer)
CREATE TABLE IF NOT EXISTS ticket_attachments (
    attachment_id BIGINT AUTO_INCREMENT NOT NULL,
    ticket_id BIGINT NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    stored_name VARCHAR(300) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (attachment_id),
    CONSTRAINT FK_ticket_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS IX_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
