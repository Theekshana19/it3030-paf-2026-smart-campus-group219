CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    start_at DATETIME(6) NOT NULL,
    end_at DATETIME(6) NOT NULL,
    status VARCHAR(20) NOT NULL,
    decision_note VARCHAR(500) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (booking_id),
    CONSTRAINT FK_bookings_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT FK_bookings_resources FOREIGN KEY (resource_id) REFERENCES Resources (ResourceId) ON DELETE CASCADE,
    CONSTRAINT CK_bookings_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT CK_bookings_window CHECK (start_at < end_at)
);

CREATE INDEX IX_bookings_user_id ON bookings (user_id);
CREATE INDEX IX_bookings_resource_id ON bookings (resource_id);
CREATE INDEX IX_bookings_status ON bookings (status);

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000) NULL,
    status VARCHAR(30) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (ticket_id),
    CONSTRAINT FK_tickets_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT CK_tickets_status CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

CREATE INDEX IX_tickets_user_id ON tickets (user_id);
CREATE INDEX IX_tickets_status ON tickets (status);

CREATE TABLE IF NOT EXISTS ticket_comments (
    comment_id BIGINT NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    body VARCHAR(2000) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (comment_id),
    CONSTRAINT FK_ticket_comments_tickets FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) ON DELETE CASCADE,
    CONSTRAINT FK_ticket_comments_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX IX_ticket_comments_ticket_id ON ticket_comments (ticket_id);
