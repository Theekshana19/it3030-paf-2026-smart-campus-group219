ALTER TABLE resources
ADD COLUMN IF NOT EXISTS equipment_subtype VARCHAR(80) NULL;
CREATE INDEX IF NOT EXISTS IX_resources_equipment_subtype ON resources(equipment_subtype);
