-- V4__Create_patient_uploads_and_notes_tables.sql
-- Patient-uploaded documents and notes

-- Patient uploads table (external reports uploaded by patients)
CREATE TABLE patient_uploads (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    organ_id BIGINT,
    document_name VARCHAR(200) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    description TEXT,
    is_verified BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (organ_id) REFERENCES organs(id) ON DELETE SET NULL
);

-- Patient notes table (optional health notes by patients)
CREATE TABLE patient_notes (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    organ_id BIGINT,
    note_text TEXT NOT NULL,
    note_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (organ_id) REFERENCES organs(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_patient_uploads_patient_id ON patient_uploads(patient_id);
CREATE INDEX idx_patient_uploads_organ_id ON patient_uploads(organ_id);
CREATE INDEX idx_patient_notes_patient_id ON patient_notes(patient_id);
CREATE INDEX idx_patient_notes_organ_id ON patient_notes(organ_id);
