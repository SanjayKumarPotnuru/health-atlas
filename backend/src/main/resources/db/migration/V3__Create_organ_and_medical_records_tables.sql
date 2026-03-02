-- V3__Create_organ_and_medical_records_tables.sql
-- Organ-based medical history tables

-- Organs table (predefined organ types)
CREATE TABLE organs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Medical records table (immutable, append-only)
CREATE TABLE medical_records (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    organ_id BIGINT NOT NULL,
    diagnosis TEXT NOT NULL,
    prescriptions TEXT,
    clinical_notes TEXT,
    treatment_status VARCHAR(20) NOT NULL CHECK (treatment_status IN ('NORMAL', 'UNDER_TREATMENT')),
    record_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (organ_id) REFERENCES organs(id) ON DELETE RESTRICT
);

-- Lab reports and test results (associated with medical records)
CREATE TABLE lab_reports (
    id BIGSERIAL PRIMARY KEY,
    medical_record_id BIGINT NOT NULL,
    report_name VARCHAR(200) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by_doctor_id BIGINT NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_organ_id ON medical_records(organ_id);
CREATE INDEX idx_medical_records_patient_organ ON medical_records(patient_id, organ_id);
CREATE INDEX idx_medical_records_record_date ON medical_records(record_date);
CREATE INDEX idx_lab_reports_medical_record_id ON lab_reports(medical_record_id);

-- Insert predefined organs
INSERT INTO organs (name, display_name, category, description) VALUES
('brain', 'Brain', 'Nervous System', 'Central nervous system control center'),
('heart', 'Heart', 'Cardiovascular System', 'Pumps blood throughout the body'),
('lungs', 'Lungs', 'Respiratory System', 'Organs for breathing and gas exchange'),
('liver', 'Liver', 'Digestive System', 'Detoxification and metabolic functions'),
('kidneys', 'Kidneys', 'Urinary System', 'Filter blood and produce urine'),
('stomach', 'Stomach', 'Digestive System', 'Digestive organ'),
('intestines', 'Intestines', 'Digestive System', 'Nutrient absorption'),
('pancreas', 'Pancreas', 'Endocrine System', 'Produces insulin and digestive enzymes'),
('spleen', 'Spleen', 'Immune System', 'Filters blood and immune function'),
('thyroid', 'Thyroid', 'Endocrine System', 'Regulates metabolism'),
('skin', 'Skin', 'Integumentary System', 'Protective outer layer'),
('bones', 'Bones', 'Skeletal System', 'Structural support and protection'),
('eyes', 'Eyes', 'Sensory System', 'Vision'),
('ears', 'Ears', 'Sensory System', 'Hearing and balance');
