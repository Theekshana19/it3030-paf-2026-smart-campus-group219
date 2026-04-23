-- bookings table for resource booking management
CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGINT AUTO_INCREMENT NOT NULL,
    booking_ref VARCHAR(30) NOT NULL,
    resource_id BIGINT NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    expected_count INT NULL,
    booking_status VARCHAR(20) NOT NULL,
    admin_remark VARCHAR(500) NULL,
    reviewed_by VARCHAR(150) NULL,
    reviewed_at DATETIME(6) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (booking_id),
    UNIQUE KEY UQ_bookings_booking_ref (booking_ref),
    CONSTRAINT FK_bookings_resource FOREIGN KEY (resource_id) REFERENCES resources(resource_id),
    CHECK (
        booking_status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')
    ),
    CHECK (start_time < end_time),
    CHECK (
        expected_count IS NULL
        OR expected_count >= 0
    )
);
CREATE INDEX IF NOT EXISTS IX_bookings_resource_id ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS IX_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS IX_bookings_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS IX_bookings_user_email ON bookings(user_email);
