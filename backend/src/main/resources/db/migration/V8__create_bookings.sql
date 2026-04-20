-- bookings table for resource booking management
IF OBJECT_ID(N'dbo.bookings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.bookings (
        booking_id BIGINT IDENTITY(1,1) NOT NULL,
        booking_ref NVARCHAR(30) NOT NULL,
        resource_id BIGINT NOT NULL,
        user_email NVARCHAR(150) NOT NULL,
        user_name NVARCHAR(100) NOT NULL,
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        purpose NVARCHAR(500) NOT NULL,
        expected_count INT NULL,
        booking_status NVARCHAR(20) NOT NULL,
        admin_remark NVARCHAR(500) NULL,
        reviewed_by NVARCHAR(150) NULL,
        reviewed_at DATETIME2(7) NULL,
        is_active BIT NOT NULL CONSTRAINT DF_bookings_is_active DEFAULT (1),
        created_at DATETIME2(7) NOT NULL CONSTRAINT DF_bookings_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at DATETIME2(7) NOT NULL CONSTRAINT DF_bookings_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_bookings PRIMARY KEY (booking_id),
        CONSTRAINT UQ_bookings_booking_ref UNIQUE (booking_ref),
        CONSTRAINT FK_bookings_resource FOREIGN KEY (resource_id) REFERENCES dbo.resources(resource_id),
        CONSTRAINT CK_bookings_status
            CHECK (booking_status IN (N'PENDING', N'APPROVED', N'REJECTED', N'CANCELLED')),
        CONSTRAINT CK_bookings_time_range
            CHECK (start_time < end_time),
        CONSTRAINT CK_bookings_expected_count
            CHECK (expected_count IS NULL OR expected_count >= 0)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_bookings_resource_id' AND object_id = OBJECT_ID(N'dbo.bookings'))
    CREATE INDEX IX_bookings_resource_id ON dbo.bookings(resource_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_bookings_booking_date' AND object_id = OBJECT_ID(N'dbo.bookings'))
    CREATE INDEX IX_bookings_booking_date ON dbo.bookings(booking_date);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_bookings_booking_status' AND object_id = OBJECT_ID(N'dbo.bookings'))
    CREATE INDEX IX_bookings_booking_status ON dbo.bookings(booking_status);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_bookings_user_email' AND object_id = OBJECT_ID(N'dbo.bookings'))
    CREATE INDEX IX_bookings_user_email ON dbo.bookings(user_email);
GO
