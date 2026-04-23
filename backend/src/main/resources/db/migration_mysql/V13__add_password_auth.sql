-- Allow google_sub to be NULL for manually-registered users
ALTER TABLE users MODIFY COLUMN google_sub VARCHAR(255) NULL;

-- Add password_hash for manual login (NULL for Google-only accounts)
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER google_sub;
