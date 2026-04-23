-- Make google_sub nullable (if present) and add password_hash for SQL Server
IF COL_LENGTH('dbo.users', 'google_sub') IS NOT NULL
BEGIN
    ALTER TABLE dbo.users ALTER COLUMN google_sub NVARCHAR(255) NULL;
END
GO

IF COL_LENGTH('dbo.users', 'password_hash') IS NULL
BEGIN
    ALTER TABLE dbo.users ADD password_hash NVARCHAR(255) NULL;
END
GO
