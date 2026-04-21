ALTER TABLE Resources
    ADD COLUMN EquipmentSubtype VARCHAR(80) NULL;

CREATE INDEX IX_resources_equipment_subtype ON Resources (EquipmentSubtype);
