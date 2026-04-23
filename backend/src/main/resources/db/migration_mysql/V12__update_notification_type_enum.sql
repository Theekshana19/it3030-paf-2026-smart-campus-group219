-- Drop any existing CHECK constraint on notifications.type (handles unnamed constraints)
SET @check_name = (
    SELECT CONSTRAINT_NAME
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'notifications'
      AND CONSTRAINT_TYPE = 'CHECK'
    LIMIT 1
);

SET @drop_sql = IF(
    @check_name IS NOT NULL,
    CONCAT('ALTER TABLE notifications DROP CONSTRAINT `', @check_name, '`'),
    'DO 0'
);
PREPARE drop_stmt FROM @drop_sql;
EXECUTE drop_stmt;
DEALLOCATE PREPARE drop_stmt;

-- Add updated constraint that includes BOOKING and TICKET
ALTER TABLE notifications
ADD CONSTRAINT CK_notifications_type CHECK (
    type IN ('SYSTEM', 'RESOURCE', 'ROLE', 'BOOKING', 'TICKET')
);
