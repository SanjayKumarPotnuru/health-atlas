-- V14: Add sample prescriptions for testing

-- Prescription 1: Arjun Menon (Fractured leg - Dr. Priya Reddy - Orthopedics)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'FOLLOW_UP',
    'Leg pain and swelling after motorcycle accident',
    'Left femur fracture - mid-shaft compound fracture Grade II',
    '120/80 mmHg',
    '24.5',
    '98.6°F',
    '72 bpm',
    'Post-operative review. Cast intact. Swelling reduced. Patient advised to continue rest and avoid weight bearing.',
    CURRENT_DATE + INTERVAL '14 days',
    'Schedule X-ray to check bone healing progress',
    CURRENT_DATE - INTERVAL '15 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Arjun' AND p.last_name = 'Menon'
  AND d.first_name = 'Priya' AND d.last_name = 'Reddy'
  AND mr.patient_id = p.id
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Tramadol', 'Tramadol Hydrochloride', '50mg', 'TWICE_DAILY', 'ORAL', 'After meals', '14 days', 'For pain management. Take with food to avoid nausea.'),
(currval('prescriptions_id_seq'), 2, 'Calcium Citrate', 'Calcium Supplement', '500mg', 'ONCE_DAILY', 'ORAL', 'After dinner', '60 days', 'For bone healing. Can be taken with vitamin D.'),
(currval('prescriptions_id_seq'), 3, 'Vitamin D3', 'Cholecalciferol', '1000 IU', 'ONCE_DAILY', 'ORAL', 'Morning', '60 days', 'Helps calcium absorption.'),
(currval('prescriptions_id_seq'), 4, 'Diclofenac Gel', 'Diclofenac Sodium', '1%', 'THRICE_DAILY', 'TOPICAL', 'Apply around cast area', '14 days', 'For localized pain relief. Avoid broken skin.');

-- Prescription 2: Sneha Iyer (Heart condition - Dr. Rajesh Sharma - Cardiology)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'FOLLOW_UP',
    'Irregular heartbeat and palpitations',
    'Atrial Fibrillation with moderate ventricular response',
    '130/85 mmHg',
    '26.8',
    '98.4°F',
    '88 bpm (irregular)',
    'Patient responding well to anticoagulation therapy. Heart rate better controlled. Continue current medications. INR levels within target range.',
    CURRENT_DATE + INTERVAL '30 days',
    'Repeat ECG and blood work for INR monitoring',
    CURRENT_DATE - INTERVAL '30 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Sneha' AND p.last_name = 'Iyer'
  AND d.first_name = 'Rajesh' AND d.last_name = 'Sharma'
  AND mr.patient_id = p.id
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Apixaban', 'Apixaban', '5mg', 'TWICE_DAILY', 'ORAL', '12 hours apart', '90 days', 'Blood thinner. Do not skip doses. Avoid major dietary changes.'),
(currval('prescriptions_id_seq'), 2, 'Metoprolol', 'Metoprolol Succinate', '50mg', 'TWICE_DAILY', 'ORAL', 'Morning and evening', '90 days', 'Beta-blocker for heart rate control. Do not stop abruptly.'),
(currval('prescriptions_id_seq'), 3, 'Atorvastatin', 'Atorvastatin Calcium', '20mg', 'ONCE_DAILY', 'ORAL', 'Bedtime', '90 days', 'For cholesterol management. Avoid grapefruit juice.');

-- Prescription 3: Vikram Desai (Stomach ulcers - Dr. Amit Patel - Gastroenterology)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'NORMAL',
    'Severe abdominal pain, nausea, and black stools',
    'Peptic ulcer disease with H. pylori infection',
    '115/75 mmHg',
    '27.3',
    '98.2°F',
    '68 bpm',
    'Endoscopy showed multiple gastric ulcers. Started triple therapy for H. pylori eradication. Patient advised strict dietary modifications.',
    CURRENT_DATE + INTERVAL '42 days',
    'Repeat H. pylori breath test. Schedule follow-up endoscopy if symptoms persist.',
    CURRENT_DATE - INTERVAL '10 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Vikram' AND p.last_name = 'Desai'
  AND d.first_name = 'Amit' AND d.last_name = 'Patel'
  AND mr.patient_id = p.id
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Omeprazole', 'Omeprazole', '40mg', 'ONCE_DAILY', 'ORAL', '30 min before breakfast', '42 days', 'Proton pump inhibitor. Take on empty stomach for best effect.'),
(currval('prescriptions_id_seq'), 2, 'Amoxicillin', 'Amoxicillin', '1000mg', 'TWICE_DAILY', 'ORAL', 'After meals', '14 days', 'Antibiotic for H. pylori. Complete full course even if feeling better.'),
(currval('prescriptions_id_seq'), 3, 'Clarithromycin', 'Clarithromycin', '500mg', 'TWICE_DAILY', 'ORAL', 'After meals', '14 days', 'Antibiotic for H. pylori. May cause metallic taste - this is normal.'),
(currval('prescriptions_id_seq'), 4, 'Sucralfate', 'Sucralfate', '1gm', 'FOUR_TIMES_DAILY', 'ORAL', '1 hour before meals', '30 days', 'Coating agent for ulcer protection. Take separately from other medicines.');

-- Prescription 4: Ananya Krishnan (Migraine - Dr. Kavita Singh - Neurology)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'FOLLOW_UP',
    'Severe recurring headaches with visual disturbances',
    'Chronic Migraine with Aura',
    '110/70 mmHg',
    '22.1',
    '97.8°F',
    '64 bpm',
    'Migraine frequency reduced from 15 to 8 days per month with preventive therapy. Patient maintaining headache diary. Reviewing triggers.',
    CURRENT_DATE + INTERVAL '60 days',
    'Continue preventive medication. Consider Botox therapy if frequency remains high.',
    CURRENT_DATE - INTERVAL '45 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Ananya' AND p.last_name = 'Krishnan'
  AND d.first_name = 'Kavita' AND d.last_name = 'Singh'
  AND mr.patient_id = p.id
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Sumatriptan', 'Sumatriptan Succinate', '50mg', 'AS_NEEDED', 'ORAL', 'At onset of migraine', '30 days supply', 'Take at first sign of migraine. Maximum 2 tablets per day, 100mg total.'),
(currval('prescriptions_id_seq'), 2, 'Propranolol', 'Propranolol Hydrochloride', '80mg', 'ONCE_DAILY', 'ORAL', 'Bedtime', '90 days', 'Preventive medication. May cause fatigue initially - this improves.'),
(currval('prescriptions_id_seq'), 3, 'Magnesium Glycinate', 'Magnesium Supplement', '400mg', 'ONCE_DAILY', 'ORAL', 'Evening with food', '90 days', 'For migraine prevention. May have mild laxative effect.');

-- Prescription 5: Rohit Malhotra (Kidney stones - Dr. Suresh Kumar - General Medicine)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'EMERGENCY',
    'Severe flank pain radiating to groin, blood in urine',
    'Bilateral renal calculi - kidney stones',
    '140/90 mmHg',
    '28.5',
    '99.1°F',
    '85 bpm',
    'Patient in severe pain. CT scan reveals 8mm stone right kidney, 5mm left kidney. Started on medical expulsive therapy. Adequate hydration crucial.',
    CURRENT_DATE + INTERVAL '28 days',
    'Repeat ultrasound to check stone passage. Consider lithotripsy if no progress.',
    CURRENT_DATE - INTERVAL '5 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Rohit' AND p.last_name = 'Malhotra'
  AND d.first_name = 'Suresh' AND d.last_name = 'Kumar'
  AND mr.patient_id = p.id
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Tamsulosin', 'Tamsulosin Hydrochloride', '0.4mg', 'ONCE_DAILY', 'ORAL', '30 min after same meal', '28 days', 'Helps relax ureter to pass stones. May cause dizziness - rise slowly.'),
(currval('prescriptions_id_seq'), 2, 'Diclofenac Sodium', 'Diclofenac', '50mg', 'AS_NEEDED', 'ORAL', 'With food when pain occurs', '14 days supply', 'For pain relief. Maximum 3 times daily. Take with food.'),
(currval('prescriptions_id_seq'), 3, 'Potassium Citrate', 'Potassium Citrate', '10 mEq', 'TWICE_DAILY', 'ORAL', 'After meals', '60 days', 'Prevents stone formation. Dissolve in water. Drink 3-4 liters water daily.');
