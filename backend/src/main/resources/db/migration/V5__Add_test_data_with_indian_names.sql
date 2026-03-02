-- V5__Add_test_data_with_indian_names.sql
-- Test data with Indian names for doctors and patients

-- Insert 5 doctors with Indian names
-- Password for all test users: Password123!

INSERT INTO users (email, password, role, is_active) VALUES
('dr.rajesh.sharma@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'DOCTOR', true),
('dr.priya.reddy@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'DOCTOR', true),
('dr.amit.patel@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'DOCTOR', true),
('dr.kavita.singh@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'DOCTOR', true),
('dr.suresh.kumar@healthatlas.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'DOCTOR', true);

INSERT INTO doctors (user_id, first_name, last_name, specialization, license_number, phone, hospital_affiliation, years_of_experience) VALUES
((SELECT id FROM users WHERE email = 'dr.rajesh.sharma@healthatlas.com'), 'Rajesh', 'Sharma', 'Cardiology', 'MCI-CARD-45621', '+91-98765-43201', 'Apollo Hospital, Delhi', 15),
((SELECT id FROM users WHERE email = 'dr.priya.reddy@healthatlas.com'), 'Priya', 'Reddy', 'Orthopedics', 'MCI-ORTH-78934', '+91-98765-43202', 'Fortis Hospital, Bangalore', 12),
((SELECT id FROM users WHERE email = 'dr.amit.patel@healthatlas.com'), 'Amit', 'Patel', 'Gastroenterology', 'MCI-GAST-56123', '+91-98765-43203', 'Lilavati Hospital, Mumbai', 10),
((SELECT id FROM users WHERE email = 'dr.kavita.singh@healthatlas.com'), 'Kavita', 'Singh', 'Neurology', 'MCI-NEUR-89456', '+91-98765-43204', 'AIIMS, New Delhi', 18),
((SELECT id FROM users WHERE email = 'dr.suresh.kumar@healthatlas.com'), 'Suresh', 'Kumar', 'General Medicine', 'MCI-GENM-34567', '+91-98765-43205', 'Max Hospital, Hyderabad', 20);

-- Insert 10 patients with Indian names
INSERT INTO users (email, password, role, is_active) VALUES
('arjun.menon@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('sneha.iyer@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('vikram.desai@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('ananya.krishnan@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('rohit.malhotra@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('divya.nair@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('karthik.rao@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('neha.gupta@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('aditya.chopra@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true),
('pooja.bhatt@email.com', '$2a$10$Cjo94guhrOC9QuNYcJuI9eO4Uh1FUv5iDLupguVpwormZKiBiTBz.', 'PATIENT', true);

INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, phone, address, emergency_contact, emergency_phone) VALUES
((SELECT id FROM users WHERE email = 'arjun.menon@email.com'), 'Arjun', 'Menon', '1985-03-15', 'MALE', '+91-98765-11111', 'MG Road, Kochi, Kerala', 'Lakshmi Menon', '+91-98765-11112'),
((SELECT id FROM users WHERE email = 'sneha.iyer@email.com'), 'Sneha', 'Iyer', '1990-07-22', 'FEMALE', '+91-98765-22222', 'T Nagar, Chennai, Tamil Nadu', 'Ramesh Iyer', '+91-98765-22223'),
((SELECT id FROM users WHERE email = 'vikram.desai@email.com'), 'Vikram', 'Desai', '1978-11-10', 'MALE', '+91-98765-33333', 'Koregaon Park, Pune, Maharashtra', 'Sunita Desai', '+91-98765-33334'),
((SELECT id FROM users WHERE email = 'ananya.krishnan@email.com'), 'Ananya', 'Krishnan', '1995-05-30', 'FEMALE', '+91-98765-44444', 'Indiranagar, Bangalore, Karnataka', 'Vijay Krishnan', '+91-98765-44445'),
((SELECT id FROM users WHERE email = 'rohit.malhotra@email.com'), 'Rohit', 'Malhotra', '1982-09-18', 'MALE', '+91-98765-55555', 'Connaught Place, New Delhi', 'Ritu Malhotra', '+91-98765-55556'),
((SELECT id FROM users WHERE email = 'divya.nair@email.com'), 'Divya', 'Nair', '1988-12-05', 'FEMALE', '+91-98765-66666', 'Banjara Hills, Hyderabad, Telangana', 'Sunil Nair', '+91-98765-66667'),
((SELECT id FROM users WHERE email = 'karthik.rao@email.com'), 'Karthik', 'Rao', '1975-04-25', 'MALE', '+91-98765-77777', 'Jubilee Hills, Hyderabad, Telangana', 'Meera Rao', '+91-98765-77778'),
((SELECT id FROM users WHERE email = 'neha.gupta@email.com'), 'Neha', 'Gupta', '1992-08-14', 'FEMALE', '+91-98765-88888', 'Sector 17, Chandigarh', 'Rajiv Gupta', '+91-98765-88889'),
((SELECT id FROM users WHERE email = 'aditya.chopra@email.com'), 'Aditya', 'Chopra', '1987-02-28', 'MALE', '+91-98765-99999', 'Andheri West, Mumbai, Maharashtra', 'Sonia Chopra', '+91-98765-99990'),
((SELECT id FROM users WHERE email = 'pooja.bhatt@email.com'), 'Pooja', 'Bhatt', '1993-10-12', 'FEMALE', '+91-98765-00000', 'Salt Lake, Kolkata, West Bengal', 'Ashok Bhatt', '+91-98765-00001');

-- Medical Records with detailed diagnoses for different body parts

-- Patient 1: Arjun Menon - Fractured leg (bones issue)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Priya' AND last_name = 'Reddy'),
 (SELECT id FROM organs WHERE name = 'bones'),
 'Left femur fracture at mid-shaft. Compound fracture Grade II with significant displacement.',
 'Pain management: Tramadol 50mg (twice daily), Calcium supplements 500mg (once daily), Physical therapy starting week 4',
 'Patient sustained fracture from motorcycle accident. Surgery performed for open reduction and internal fixation. Cast applied. Expected recovery: 8-12 weeks. Follow-up in 2 weeks for X-ray.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '15 days');

-- Patient 2: Sneha Iyer - Heart condition (cardiovascular)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 (SELECT id FROM organs WHERE name = 'heart'),
 'Atrial Fibrillation (AFib) with moderate ventricular response rate. Ejection fraction: 45%',
 'Apixaban 5mg (twice daily), Metoprolol 50mg (twice daily), Regular ECG monitoring',
 'Patient presented with irregular heartbeat and palpitations. EKG shows AFib. Started on anticoagulation therapy. Risk of stroke - managing with blood thinners. Lifestyle modifications recommended.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '30 days');

-- Patient 3: Vikram Desai - Stomach ulcers
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Vikram' AND last_name = 'Desai'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 (SELECT id FROM organs WHERE name = 'stomach'),
 'Peptic ulcer disease with H. pylori infection. Multiple ulcers detected in gastric antrum.',
 'Omeprazole 40mg (once daily before breakfast), Amoxicillin 1g + Clarithromycin 500mg (triple therapy for H. pylori), Avoid NSAIDs',
 'Endoscopy revealed 3 ulcers approximately 5-8mm in size. H. pylori test positive. Started on triple therapy. Dietary modifications: avoid spicy food, alcohol, smoking. Follow-up endoscopy in 6 weeks.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '10 days');

-- Patient 4: Ananya Krishnan - Migraine (brain/neurological)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Ananya' AND last_name = 'Krishnan'),
 (SELECT id FROM doctors WHERE first_name = 'Kavita' AND last_name = 'Singh'),
 (SELECT id FROM organs WHERE name = 'brain'),
 'Chronic Migraine with Aura. Frequency: 15+ headache days per month, with severe migraine attacks 8-10 days/month',
 'Sumatriptan 50mg (as needed for acute attacks, max 2/day), Propranolol 80mg (daily preventive), Magnesium supplements',
 'Patient experiencing debilitating migraines affecting work and daily life. MRI brain scan ruled out structural abnormalities. Triggers identified: stress, lack of sleep, bright lights. Recommend headache diary.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '45 days');

-- Patient 5: Rohit Malhotra - Kidney stones
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'kidneys'),
 'Bilateral renal calculi (kidney stones). Right kidney: 8mm stone in upper calyx. Left kidney: 5mm stone in mid-calyx',
 'Tamsulosin 0.4mg (once daily), Pain relief: Diclofenac 50mg (as needed), Increase water intake to 3-4 liters/day',
 'Patient presented with severe flank pain and hematuria. CT scan confirms multiple kidney stones. Conservative management with medication to facilitate stone passage. If stones do not pass in 4 weeks, consider lithotripsy.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '7 days');

-- Patient 6: Divya Nair - Respiratory infection (lungs)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Divya' AND last_name = 'Nair'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'lungs'),
 'Acute Bronchitis with lower respiratory tract infection. Moderate wheezing and productive cough.',
 'Azithromycin 500mg (day 1), then 250mg (days 2-5), Salbutamol inhaler (2 puffs every 6 hours), Mucolytic syrup',
 'Patient has persistent cough for 2 weeks with yellowish sputum. Chest X-ray shows increased bronchovascular markings. No pneumonia. Breathing exercises recommended. Avoid cold air and dust.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '5 days');

-- Patient 7: Karthik Rao - Liver disease
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Karthik' AND last_name = 'Rao'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 (SELECT id FROM organs WHERE name = 'liver'),
 'Non-Alcoholic Fatty Liver Disease (NAFLD) - Grade 2. Elevated liver enzymes: ALT 78 U/L, AST 65 U/L',
 'Vitamin E supplements 400 IU (daily), Ursodeoxycholic acid 300mg (twice daily), Weight loss program',
 'Ultrasound shows moderate hepatic steatosis. No cirrhosis. Associated with metabolic syndrome. Patient needs to lose 10% body weight. Diet: low carb, low fat. Exercise: 30 min daily walking. Recheck LFTs in 3 months.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '20 days');

-- Patient 8: Neha Gupta - Thyroid disorder
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Neha' AND last_name = 'Gupta'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'thyroid'),
 'Hypothyroidism - Primary. TSH elevated at 12.5 mIU/L (normal: 0.4-4.0). Free T4 low at 0.6 ng/dL',
 'Levothyroxine 75mcg (once daily on empty stomach, 30 min before breakfast), Monthly TSH monitoring for first 3 months',
 'Patient complaining of fatigue, weight gain (5kg in 3 months), cold intolerance, and constipation. Confirmed hypothyroidism. Started on thyroid replacement therapy. Recheck thyroid function in 6 weeks.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '12 days');

-- Patient 9: Aditya Chopra - Eye problem (vision)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Aditya' AND last_name = 'Chopra'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'eyes'),
 'Diabetic Retinopathy - Moderate Non-Proliferative stage. Microaneurysms and hemorrhages in both eyes.',
 'Strict blood sugar control (target HbA1c < 7%), Laser photocoagulation scheduled, Regular ophthalmology follow-up every 3 months',
 'Patient is diabetic for 8 years with poor glycemic control. Fundoscopy shows retinal changes. Risk of vision loss if not managed. Referred to retina specialist for possible laser treatment. Emphasize importance of diabetes control.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '25 days');

-- Patient 10: Pooja Bhatt - Skin condition (dermatological)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'skin'),
 'Moderate Psoriasis vulgaris affecting elbows, knees, and scalp. Approximately 15% body surface area involved.',
 'Topical: Clobetasol propionate 0.05% cream (twice daily on plaques), Calcipotriol ointment, Coal tar shampoo for scalp. Oral: Methotrexate 15mg (weekly)',
 'Patient has chronic plaque psoriasis. Recent flare-up due to stress. Skin biopsy confirmed diagnosis. Started on systemic therapy as topical alone insufficient. Monitor liver function monthly due to methotrexate. Phototherapy option if no improvement.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '18 days');

-- Additional medical records to show patient-doctor relationships and history

-- Patient 2: Sneha Iyer - Previous general checkup
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'heart'),
 'Annual cardiac checkup - pre-AFib diagnosis. Mild tachycardia noted.',
 'Lifestyle modifications recommended',
 'Routine checkup showed resting heart rate of 95 bpm. Suggested stress reduction and regular exercise. This was before AFib diagnosis.',
 'NORMAL',
 CURRENT_DATE - INTERVAL '180 days');

-- Patient 5: Rohit Malhotra - Previous kidney checkup
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'kidneys'),
 'Routine kidney function test - All parameters normal',
 'None required',
 'Annual health checkup. eGFR: 95 ml/min, Creatinine: 0.9 mg/dL. All normal. Recommended adequate hydration.',
 'NORMAL',
 CURRENT_DATE - INTERVAL '365 days');

-- Consent Management: Doctor-Patient Access Control
-- Establish relationships between doctors and patients with various consent statuses

-- Patient 1: Arjun Menon - Consents
-- Approved: Dr. Priya Reddy (Orthopedics) - treating fractured leg
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Priya' AND last_name = 'Reddy'),
 'THIRTY_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '35 days',
 CURRENT_DATE - INTERVAL '33 days',
 CURRENT_DATE - INTERVAL '3 days');

-- Pending: Dr. Rajesh Sharma (Cardiology) - requesting access for cardiac evaluation
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 'SEVEN_DAYS',
 'PENDING',
 CURRENT_DATE - INTERVAL '2 days');

-- Patient 2: Sneha Iyer - Consents
-- Approved: Dr. Rajesh Sharma (Cardiology) - treating AFib
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 'ALWAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '45 days',
 CURRENT_DATE - INTERVAL '44 days',
 NULL);

-- Approved: Dr. Suresh Kumar (General Medicine) - general monitoring
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 'THIRTY_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '20 days',
 CURRENT_DATE - INTERVAL '19 days',
 CURRENT_DATE + INTERVAL '10 days');

-- Patient 3: Vikram Desai - Consents
-- Approved: Dr. Amit Patel (Gastroenterology) - treating peptic ulcer
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Vikram' AND last_name = 'Desai'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 'ALWAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '30 days',
 CURRENT_DATE - INTERVAL '29 days',
 NULL);

-- Pending: Dr. Rajesh Sharma (Cardiology) - requesting for comprehensive checkup
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Vikram' AND last_name = 'Desai'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 'ONE_TIME',
 'PENDING',
 CURRENT_DATE - INTERVAL '1 days');

-- Patient 4: Ananya Krishnan - Consents
-- Approved: Dr. Kavita Singh (Neurology) - treating migraine
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Ananya' AND last_name = 'Krishnan'),
 (SELECT id FROM doctors WHERE first_name = 'Kavita' AND last_name = 'Singh'),
 'THIRTY_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '25 days',
 CURRENT_DATE - INTERVAL '24 days',
 CURRENT_DATE + INTERVAL '5 days');

-- Revoked: Dr. Suresh Kumar (General Medicine) - patient revoked access
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, revoked_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Ananya' AND last_name = 'Krishnan'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 'SEVEN_DAYS',
 'REVOKED',
 CURRENT_DATE - INTERVAL '60 days',
 CURRENT_DATE - INTERVAL '58 days',
 CURRENT_DATE - INTERVAL '40 days');

-- Patient 5: Rohit Malhotra - Consents
-- Approved: Dr. Suresh Kumar (General Medicine) - treating UTI
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 'THIRTY_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '14 days',
 CURRENT_DATE - INTERVAL '13 days',
 CURRENT_DATE + INTERVAL '16 days');

-- Pending: Dr. Kavita Singh (Neurology) - requesting neurological assessment
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 (SELECT id FROM doctors WHERE first_name = 'Kavita' AND last_name = 'Singh'),
 'SEVEN_DAYS',
 'PENDING',
 CURRENT_DATE);

-- Patient 6: Divya Nair - Consents
-- Approved: Dr. Rajesh Sharma (Cardiology) - treating pneumonia (lung specialist consult)
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Divya' AND last_name = 'Nair'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 'SEVEN_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '10 days',
 CURRENT_DATE - INTERVAL '9 days',
 CURRENT_DATE - INTERVAL '2 days');

-- Pending: Dr. Amit Patel (Gastroenterology) - requesting access
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Divya' AND last_name = 'Nair'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 'THIRTY_DAYS',
 'PENDING',
 CURRENT_DATE - INTERVAL '3 days');

-- Patient 7: Karthik Rao - Consents
-- Approved: Dr. Amit Patel (Gastroenterology) - treating fatty liver
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Karthik' AND last_name = 'Rao'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 'ALWAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '50 days',
 CURRENT_DATE - INTERVAL '49 days',
 NULL);

-- Approved: Dr. Suresh Kumar (General Medicine) - general health monitoring
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Karthik' AND last_name = 'Rao'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 'ALWAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '100 days',
 CURRENT_DATE - INTERVAL '99 days',
 NULL);

-- Patient 8: Neha Gupta - Consents
-- Approved: Dr. Kavita Singh (Neurology) - treating hypothyroidism with neurological symptoms
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Neha' AND last_name = 'Gupta'),
 (SELECT id FROM doctors WHERE first_name = 'Kavita' AND last_name = 'Singh'),
 'THIRTY_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '22 days',
 CURRENT_DATE - INTERVAL '21 days',
 CURRENT_DATE + INTERVAL '8 days');

-- Pending: Dr. Priya Reddy (Orthopedics) - requesting consultation
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Neha' AND last_name = 'Gupta'),
 (SELECT id FROM doctors WHERE first_name = 'Priya' AND last_name = 'Reddy'),
 'ONE_TIME',
 'PENDING',
 CURRENT_DATE - INTERVAL '1 days');

-- Patient 9: Aditya Chopra - Consents
-- Approved: Dr. Priya Reddy (Orthopedics) - treating diabetic retinopathy (eye specialist consult)
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Aditya' AND last_name = 'Chopra'),
 (SELECT id FROM doctors WHERE first_name = 'Priya' AND last_name = 'Reddy'),
 'ALWAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '40 days',
 CURRENT_DATE - INTERVAL '39 days',
 NULL);

-- Revoked: Dr. Rajesh Sharma (Cardiology) - patient denied request
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, revoked_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Aditya' AND last_name = 'Chopra'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 'SEVEN_DAYS',
 'REVOKED',
 CURRENT_DATE - INTERVAL '15 days',
 CURRENT_DATE - INTERVAL '14 days');

-- Patient 10: Pooja Bhatt - Consents
-- Approved: Dr. Suresh Kumar (General Medicine) - treating psoriasis
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at, approved_at, expires_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 'THIRTY_DAYS',
 'APPROVED',
 CURRENT_DATE - INTERVAL '20 days',
 CURRENT_DATE - INTERVAL '19 days',
 CURRENT_DATE + INTERVAL '10 days');

-- Pending: Dr. Kavita Singh (Neurology) - requesting neurological evaluation
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 (SELECT id FROM doctors WHERE first_name = 'Kavita' AND last_name = 'Singh'),
 'THIRTY_DAYS',
 'PENDING',
 CURRENT_DATE - INTERVAL '5 days');

-- Pending: Dr. Amit Patel (Gastroenterology) - requesting digestive system evaluation
INSERT INTO consents (patient_id, doctor_id, consent_type, status, requested_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 'ONE_TIME',
 'PENDING',
 CURRENT_DATE - INTERVAL '1 days');
