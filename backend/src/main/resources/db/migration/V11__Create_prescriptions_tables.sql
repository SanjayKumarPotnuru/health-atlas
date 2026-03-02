-- V11: Create prescriptions and prescription_medicines tables

CREATE TABLE prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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

-- Insert sample prescriptions for test data patients

-- Prescription 1: Dr. Priya Sharma for patient Arjun Patel (Tinea Cruris - similar to the Medicover example)
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis, vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes, prescription_date)
VALUES (1, 1, 'NORMAL', 'Itchy skin lesions in groins since 3 days and hypopigmented skin lesions on upper chest and back since 1 month', 'Tinea Cruris', '120/80', '22.5', '98.4°F', '72 bpm', 'Patient advised to maintain hygiene and avoid tight clothing. Follow up in 2 weeks.', '2026-02-15');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(1, 1, 'SYNTRAN SB', NULL, '130MG', '0-1-0', 'ORAL', 'After Lunch', '2 Weeks', NULL),
(1, 2, 'BILASTINE', NULL, '20MG', '0-0-1', 'ORAL', 'After Dinner', '10 Days', NULL),
(1, 3, 'EBERNET CREAM', 'EBERCONAZOLE (1% W/W)', NULL, '1-0-1', 'LOCAL APPLICATION', 'Not Applicable', '1 Month', NULL),
(1, 4, 'SCALPE SHAMPOO', NULL, NULL, '1-0-0', 'LOCAL APPLICATION', 'Not Applicable', '1 Month', '20 MINUTES BEFORE BATH OVER CHEST'),
(1, 5, 'CANDID DUSTING POWDER', 'CLOTRIMAZOLE (1% W/V) POWDER', NULL, '1-0-1', 'LOCAL APPLICATION', 'Not Applicable', '1 Month', NULL),
(1, 6, 'HALOX S OINTMENT', 'HALOBETASOL (0.05%W/W) + SALICYLIC ACID (3%W/W)', NULL, '0-0-1', 'LOCAL APPLICATION', 'Not Applicable', '1 Month', 'ON FINGERS');

-- Prescription 2: Dr. Raj Kumar for patient Meera Reddy (Hypertension)
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis, vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes, follow_up_date, follow_up_notes, prescription_date)
VALUES (2, 2, 'FOLLOW-UP', 'Persistent headache and dizziness for past 1 week, known hypertensive on irregular medication', 'Essential Hypertension - Stage 2', '160/100', '28.3', '98.2°F', '88 bpm', 'BP elevated. Patient admitted to missing medications for past 5 days. Counselled on medication adherence. Low salt diet advised. Regular exercise recommended.', '2026-03-01', 'Recheck BP and assess medication compliance', '2026-02-10');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(2, 1, 'TELMISARTAN', NULL, '40MG', '1-0-0', 'ORAL', 'Before Breakfast', '30 Days', NULL),
(2, 2, 'AMLODIPINE', NULL, '5MG', '0-0-1', 'ORAL', 'After Dinner', '30 Days', NULL),
(2, 3, 'ASPIRIN (ECOSPRIN)', 'ACETYLSALICYLIC ACID', '75MG', '0-1-0', 'ORAL', 'After Lunch', '30 Days', 'Take with food to avoid gastric irritation'),
(2, 4, 'ATORVASTATIN', NULL, '10MG', '0-0-1', 'ORAL', 'After Dinner', '30 Days', NULL);

-- Prescription 3: Dr. Anita Desai for patient Vikram Singh (Type 2 Diabetes)
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis, vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes, follow_up_date, follow_up_notes, prescription_date)
VALUES (3, 3, 'NORMAL', 'Increased thirst, frequent urination, and unexplained weight loss over past 2 months. Family history of diabetes (father)', 'Type 2 Diabetes Mellitus - Newly Diagnosed', '130/85', '31.2', '98.6°F', '76 bpm', 'Fasting blood sugar: 256 mg/dL, HbA1c: 9.2%. Patient counselled about lifestyle modifications, dietary changes (low carb, high fiber), and regular physical activity. Self-monitoring of blood glucose demonstrated. Diabetic foot care education provided.', '2026-03-15', 'Repeat FBS, PPBS and HbA1c. Review diet diary.', '2026-02-12');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(3, 1, 'METFORMIN SR', NULL, '500MG', '1-0-1', 'ORAL', 'After Food', '30 Days', 'Take with meals to reduce GI side effects'),
(3, 2, 'GLIMEPIRIDE', NULL, '1MG', '1-0-0', 'ORAL', 'Before Breakfast', '30 Days', 'Monitor for signs of low blood sugar'),
(3, 3, 'MULTIVITAMIN (BECOSULES)', 'B-COMPLEX + VITAMIN C', NULL, '0-1-0', 'ORAL', 'After Lunch', '30 Days', NULL),
(3, 4, 'ALPHA LIPOIC ACID', NULL, '100MG', '0-0-1', 'ORAL', 'After Dinner', '30 Days', 'For diabetic neuropathy prevention');

-- Prescription 4: Dr. Priya Sharma for patient Deepa Gupta (Migraine)
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis, vitals_bp, vitals_bmi, clinical_notes, prescription_date)
VALUES (4, 1, 'NORMAL', 'Severe unilateral throbbing headache with nausea and photophobia, occurring 3-4 times per week since 2 months. Aggravated by stress and lack of sleep.', 'Migraine without Aura - Chronic', '110/70', '24.1', 'Neurological examination normal. No focal deficits. Trigger diary recommended. Stress management and sleep hygiene counselled.', '2026-02-17');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(4, 1, 'NAPROXEN SODIUM', NULL, '550MG', 'SOS', 'ORAL', 'During Attack', 'As Needed', 'Take at onset of migraine. Maximum 2 tablets per day'),
(4, 2, 'SUMATRIPTAN', NULL, '50MG', 'SOS', 'ORAL', 'During Attack', 'As Needed', 'If pain not relieved by Naproxen after 2 hours'),
(4, 3, 'PROPRANOLOL', NULL, '20MG', '1-0-1', 'ORAL', 'After Food', '30 Days', 'Prophylactic - do not stop abruptly'),
(4, 4, 'AMITRIPTYLINE', NULL, '10MG', '0-0-1', 'ORAL', 'At Bedtime', '30 Days', 'Take 1 hour before sleep'),
(4, 5, 'DOMPERIDONE', NULL, '10MG', 'SOS', 'ORAL', 'Before Food', 'As Needed', 'For nausea during migraine attacks');
