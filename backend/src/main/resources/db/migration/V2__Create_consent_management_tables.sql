-- V2__Create_consent_management_tables.sql
-- Consent-driven access control tables

-- Consents table (manages doctor access to patient data)
CREATE TABLE consents (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    consent_type VARCHAR(20) NOT NULL CHECK (consent_type IN ('ONE_TIME', 'SEVEN_DAYS', 'THIRTY_DAYS', 'ALWAYS')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REVOKED', 'EXPIRED')),
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_consents_patient_id ON consents(patient_id);
CREATE INDEX idx_consents_doctor_id ON consents(doctor_id);
CREATE INDEX idx_consents_status ON consents(status);
CREATE INDEX idx_consents_patient_doctor ON consents(patient_id, doctor_id);

-- Note: H2 doesn't support partial unique indexes (WHERE clause)
-- Unique constraint enforcement is handled at application level
