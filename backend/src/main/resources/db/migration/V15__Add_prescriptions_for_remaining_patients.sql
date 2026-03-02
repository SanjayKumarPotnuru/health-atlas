-- V15: Add prescriptions for remaining patients (6-10)

-- Prescription 6: Divya Nair (Acute Bronchitis - Dr. Suresh Kumar - General Medicine)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'NORMAL',
    'Persistent cough with yellowish sputum and chest discomfort',
    'Acute Bronchitis - Lower respiratory tract infection',
    '118/76 mmHg',
    '25.2',
    '100.4°F',
    '82 bpm',
    'Patient has productive cough for 2 weeks. Chest auscultation reveals wheezing. X-ray shows increased bronchovascular markings, no pneumonia. Started on antibiotics and bronchodilator.',
    CURRENT_DATE + INTERVAL '7 days',
    'Reassess breathing. If improved, continue inhaler for additional week.',
    CURRENT_DATE - INTERVAL '5 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Divya' AND p.last_name = 'Nair'
  AND d.first_name = 'Suresh' AND d.last_name = 'Kumar'
  AND mr.patient_id = p.id AND mr.diagnosis LIKE '%Bronchitis%'
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Azithromycin', 'Azithromycin', '500mg', 'ONCE_DAILY', 'ORAL', 'Day 1: 500mg, Days 2-5: 250mg', '5 days', 'Antibiotic. Take day 1 dose before meals, remaining doses with or without food.'),
(currval('prescriptions_id_seq'), 2, 'Salbutamol Inhaler', 'Salbutamol', '100mcg/puff', 'AS_NEEDED', 'INHALATION', '2 puffs every 6 hours', '14 days', 'Bronchodilator for wheezing. Shake well before use. Rinse mouth after.'),
(currval('prescriptions_id_seq'), 3, 'Ambroxol Syrup', 'Ambroxol Hydrochloride', '30mg/5ml', 'THRICE_DAILY', 'ORAL', 'After meals', '7 days', 'Mucolytic to thin mucus. Helps with productive cough.'),
(currval('prescriptions_id_seq'), 4, 'Montair-LC', 'Montelukast + Levocetirizine', '10mg+5mg', 'ONCE_DAILY', 'ORAL', 'Bedtime', '10 days', 'For allergic component and inflammation. May cause drowsiness.');

-- Prescription 7: Karthik Rao (Fatty Liver Disease - Dr. Amit Patel - Gastroenterology)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'FOLLOW_UP',
    'Fatigue, right upper abdominal discomfort',
    'Non-Alcoholic Fatty Liver Disease (NAFLD) - Grade 2',
    '135/88 mmHg',
    '29.8',
    '98.3°F',
    '74 bpm',
    'Ultrasound confirms moderate hepatic steatosis. Elevated liver enzymes. Associated with metabolic syndrome. Weight loss and lifestyle modification crucial. Started on hepatoprotective medications.',
    CURRENT_DATE + INTERVAL '90 days',
    'Repeat liver function tests and ultrasound. Monitor weight loss progress.',
    CURRENT_DATE - INTERVAL '20 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Karthik' AND p.last_name = 'Rao'
  AND d.first_name = 'Amit' AND d.last_name = 'Patel'
  AND mr.patient_id = p.id
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Vitamin E', 'Tocopherol Acetate', '400 IU', 'ONCE_DAILY', 'ORAL', 'After lunch', '180 days', 'Antioxidant for liver protection. May improve liver inflammation.'),
(currval('prescriptions_id_seq'), 2, 'Ursodeoxycholic Acid', 'UDCA', '300mg', 'TWICE_DAILY', 'ORAL', 'After meals', '180 days', 'Hepatoprotective. Reduces liver enzyme levels. Take with food.'),
(currval('prescriptions_id_seq'), 3, 'Metformin', 'Metformin Hydrochloride', '500mg', 'TWICE_DAILY', 'ORAL', 'With meals', '180 days', 'For metabolic syndrome. Start low, may increase dose. May cause GI upset initially.'),
(currval('prescriptions_id_seq'), 4, 'Silymarin', 'Milk Thistle Extract', '140mg', 'TWICE_DAILY', 'ORAL', 'Before meals', '180 days', 'Herbal hepatoprotective. Supports liver regeneration.');

-- Prescription 8: Neha Gupta (Hypothyroidism - Dr. Suresh Kumar - General Medicine)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'NORMAL',
    'Severe fatigue, weight gain, feeling cold all the time',
    'Primary Hypothyroidism - TSH elevated',
    '108/72 mmHg',
    '27.5',
    '97.2°F',
    '58 bpm',
    'Classic symptoms of hypothyroidism confirmed by lab tests. TSH 12.5 (high), Free T4 low. Started on levothyroxine replacement. Patient educated about lifelong medication and importance of compliance.',
    CURRENT_DATE + INTERVAL '42 days',
    'Repeat TSH and Free T4. Adjust levothyroxine dose if needed.',
    CURRENT_DATE - INTERVAL '12 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Neha' AND p.last_name = 'Gupta'
  AND d.first_name = 'Suresh' AND d.last_name = 'Kumar'
  AND mr.patient_id = p.id AND mr.diagnosis LIKE '%Hypothyroidism%'
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Levothyroxine', 'Levothyroxine Sodium', '75mcg', 'ONCE_DAILY', 'ORAL', '30 min before breakfast on empty stomach', '180 days', 'Thyroid hormone replacement. MUST take on empty stomach. Wait 30-60 min before eating. Do not skip doses.'),
(currval('prescriptions_id_seq'), 2, 'Calcium Carbonate', 'Calcium Supplement', '500mg', 'ONCE_DAILY', 'ORAL', 'Evening, 4 hours after levothyroxine', '180 days', 'For bone health. Take separately from thyroid medication as calcium may interfere with absorption.'),
(currval('prescriptions_id_seq'), 3, 'Vitamin B12', 'Methylcobalamin', '1500mcg', 'ONCE_DAILY', 'ORAL', 'After lunch', '90 days', 'Often deficient in hypothyroidism. Helps with fatigue and neurological symptoms.');

-- Prescription 9: Aditya Chopra (Diabetic Retinopathy - Dr. Suresh Kumar - General Medicine)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'FOLLOW_UP',
    'Blurred vision, floaters in vision',
    'Diabetic Retinopathy - Moderate Non-Proliferative stage',
    '145/92 mmHg',
    '30.2',
    '98.8°F',
    '78 bpm',
    'Patient is long-standing diabetic with poor control. Fundoscopy reveals microaneurysms and hemorrhages bilaterally. Urgent need for strict glycemic control. Referred to ophthalmologist for laser photocoagulation. Emphasize diabetes management is critical to prevent blindness.',
    CURRENT_DATE + INTERVAL '30 days',
    'Ophthalmology follow-up. Monitor HbA1c. May need laser treatment.',
    CURRENT_DATE - INTERVAL '25 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Aditya' AND p.last_name = 'Chopra'
  AND d.first_name = 'Suresh' AND d.last_name = 'Kumar'
  AND mr.patient_id = p.id AND mr.diagnosis LIKE '%Retinopathy%'
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Metformin XR', 'Metformin Extended Release', '1000mg', 'TWICE_DAILY', 'ORAL', 'With breakfast and dinner', '90 days', 'For blood sugar control. Crucial for preventing worsening of retinopathy. Take with meals.'),
(currval('prescriptions_id_seq'), 2, 'Glimepiride', 'Glimepiride', '2mg', 'ONCE_DAILY', 'ORAL', 'Before breakfast', '90 days', 'Sulfonylurea for diabetes. Monitor for hypoglycemia. Carry sugar/candy always.'),
(currval('prescriptions_id_seq'), 3, 'Aspirin', 'Acetylsalicylic Acid', '75mg', 'ONCE_DAILY', 'ORAL', 'After dinner', '90 days', 'Blood thinner. Reduces cardiovascular risk in diabetics. Take with food.'),
(currval('prescriptions_id_seq'), 4, 'Pregabalin', 'Pregabalin', '75mg', 'ONCE_DAILY', 'ORAL', 'Bedtime', '60 days', 'For diabetic neuropathy if present. May cause dizziness initially.'),
(currval('prescriptions_id_seq'), 5, 'Lubricating Eye Drops', 'Carboxymethylcellulose', '0.5%', 'AS_NEEDED', 'TOPICAL', '4-6 times daily', '30 days', 'For dry eyes common in diabetics. Preservative-free preferred.');

-- Prescription 10: Pooja Bhatt (Psoriasis - Dr. Suresh Kumar - General Medicine)
INSERT INTO prescriptions (patient_id, doctor_id, medical_record_id, visit_type, chief_complaint, final_diagnosis, 
                          vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, 
                          clinical_notes, follow_up_date, follow_up_notes, prescription_date)
SELECT 
    p.id,
    d.id,
    mr.id,
    'FOLLOW_UP',
    'Itchy red scaly patches on elbows, knees, and scalp',
    'Moderate Psoriasis Vulgaris - affecting 15% body surface area',
    '122/78 mmHg',
    '24.8',
    '98.6°F',
    '68 bpm',
    'Chronic plaque psoriasis with recent flare-up. Skin biopsy confirmed diagnosis. Started combination therapy - topical steroids, vitamin D analog, and systemic methotrexate. Stress identified as trigger. Monitoring liver function monthly.',
    CURRENT_DATE + INTERVAL '28 days',
    'Check liver function tests. Assess response to treatment. Consider phototherapy if inadequate response.',
    CURRENT_DATE - INTERVAL '18 days'
FROM patients p
CROSS JOIN doctors d
CROSS JOIN medical_records mr
WHERE p.first_name = 'Pooja' AND p.last_name = 'Bhatt'
  AND d.first_name = 'Suresh' AND d.last_name = 'Kumar'
  AND mr.patient_id = p.id AND mr.diagnosis LIKE '%Psoriasis%'
LIMIT 1;

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES 
(currval('prescriptions_id_seq'), 1, 'Clobetasol Cream', 'Clobetasol Propionate', '0.05%', 'TWICE_DAILY', 'TOPICAL', 'Morning and night on plaques', '14 days', 'Potent topical steroid. Apply thin layer only on affected areas. Do not use on face. Maximum 2 weeks continuous use.'),
(currval('prescriptions_id_seq'), 2, 'Calcipotriol Ointment', 'Calcipotriol', '0.005%', 'TWICE_DAILY', 'TOPICAL', 'After clobetasol absorption', '60 days', 'Vitamin D analog. Apply 30 min after steroid. Slows skin cell turnover.'),
(currval('prescriptions_id_seq'), 3, 'Coal Tar Shampoo', 'Coal Tar', '2%', 'THRICE_WEEKLY', 'TOPICAL', 'Leave on scalp 5-10 min before rinsing', '60 days', 'For scalp psoriasis. May stain light-colored hair temporarily.'),
(currval('prescriptions_id_seq'), 4, 'Methotrexate', 'Methotrexate', '15mg', 'ONCE_WEEKLY', 'ORAL', 'Same day each week', '90 days', 'Systemic immunosuppressant. Take ONLY ONCE PER WEEK. Avoid alcohol. Monthly liver tests mandatory.'),
(currval('prescriptions_id_seq'), 5, 'Folic Acid', 'Folic Acid', '5mg', 'ONCE_WEEKLY', 'ORAL', 'Day after methotrexate', '90 days', 'Reduces methotrexate side effects. Take 24 hours after methotrexate dose.'),
(currval('prescriptions_id_seq'), 6, 'Moisturizing Cream', 'Emollient', 'Regular', 'MULTIPLE_TIMES', 'TOPICAL', 'Apply liberally after bath', '60 days', 'Keep skin hydrated. Apply generously especially after bathing while skin is damp.');
