-- Make doctor_id nullable in medical_records to allow patient self-reporting
ALTER TABLE medical_records 
ALTER COLUMN doctor_id BIGINT NULL;
