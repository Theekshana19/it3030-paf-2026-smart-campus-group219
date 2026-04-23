-- this table stores comments added by users and staff on tickets
-- only the original author can edit their own comment
-- admin can delete any comment
CREATE TABLE IF NOT EXISTS ticket_comments (
    comment_id BIGINT AUTO_INCREMENT NOT NULL,
    ticket_id BIGINT NOT NULL,
    author_email VARCHAR(150) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    comment_text VARCHAR(2000) NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (comment_id),
    CONSTRAINT FK_ticket_comments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS IX_ticket_comments_ticket_id ON ticket_comments(ticket_id);
