CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    read_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (notification_id),
    CONSTRAINT FK_notifications_users
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE,
    CONSTRAINT CK_notifications_type CHECK (
        type IN (
            'SYSTEM',
            'RESOURCE',
            'ROLE',
            'BOOKING_APPROVED',
            'BOOKING_REJECTED',
            'TICKET_STATUS_CHANGED',
            'TICKET_COMMENT'
        )
    )
);

CREATE INDEX IX_notifications_user_id ON notifications (user_id);
CREATE INDEX IX_notifications_created_at ON notifications (created_at);
