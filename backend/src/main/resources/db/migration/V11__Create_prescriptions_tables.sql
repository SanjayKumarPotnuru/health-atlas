-- V11: Create prescriptions and prescription_medicines tables

CREATE TABLE prescriptions (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    medical_record_id BIGINT,
    visit_type VARCHAR(50) DEFAULT 'NORMAL',
    chief_complaint TEXT,
    final_diagnosis TEXT NOT NULL,
    vitals_bp VARCHAR(20),
    vitals_bmi VARCHAR(20),
    vitals_temperature VARCHAR(20),
    vitals_pulse VARCHAR(20),
    clinical_notes TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    prescription_date DATE NOT NULL,
    pdf_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id)
);

CREATE TABLE prescription_medicines (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    serial_number INT NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    dosage VARCHAR(100),
    frequency VARCHAR(50) NOT NULL,
    route VARCHAR(50) DEFAULT 'ORAL',
    timing VARCHAR(100),
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_date ON prescriptions(prescription_date);
CREATE INDEX idx_prescription_medicines_prescription ON prescription_medicines(prescription_id);
