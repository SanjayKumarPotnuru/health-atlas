-- V12__Add_multi_organ_records_for_arjun.sql
-- Add additional medical records for Patient 1 (Arjun Menon) across multiple organs
-- This creates multiple markers on the anatomy body map

-- Heart - UNDER_TREATMENT (active red marker on chest)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Rajesh' AND last_name = 'Sharma'),
 (SELECT id FROM organs WHERE name = 'heart'),
 'Mild mitral valve regurgitation detected on routine echocardiogram. Trace to mild MR with no hemodynamic significance.',
 'Metoprolol 25mg (once daily), Low sodium diet, Annual echocardiogram follow-up',
 'Patient referred for cardiac evaluation after elevated BP readings. Echo shows mild MR with normal LV function. EF 60%. No surgical intervention needed. Lifestyle modifications advised.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '20 days');

-- Brain - NORMAL (past orange marker on head)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Kavita' AND last_name = 'Singh'),
 (SELECT id FROM organs WHERE name = 'brain'),
 'Tension-type headache with cervicogenic component. MRI brain normal. No intracranial pathology.',
 'Ibuprofen 400mg (as needed for headache), Neck stretching exercises daily, Stress management techniques',
 'Patient presented with recurring headaches lasting 3-4 hours. MRI brain and cervical spine normal. Likely stress and posture related. Resolved with lifestyle modifications and physiotherapy.',
 'NORMAL',
 CURRENT_DATE - INTERVAL '90 days');

-- Kidneys - UNDER_TREATMENT (active red marker on lower back)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'kidneys'),
 'Bilateral renal calculi. Right kidney 3mm stone in lower pole. Left kidney 4mm stone in mid-calyx. No hydronephrosis.',
 'Potassium citrate 10mEq (twice daily), Increase fluid intake to 3L/day, Low oxalate diet',
 'Patient presented with intermittent flank pain. Ultrasound confirmed small bilateral kidney stones. Conservative management initiated. Expected to pass naturally. Follow-up ultrasound in 3 months.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '10 days');

-- Lungs - NORMAL (past orange marker on chest, but heart is higher severity so chest shows red)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'lungs'),
 'Acute bronchitis following upper respiratory viral infection. Resolved completely with treatment.',
 'Course completed: Amoxicillin 500mg TID x7 days, Salbutamol inhaler PRN',
 'Presented with productive cough and low-grade fever. CXR showed mild bronchial wall thickening, no pneumonia. Completed antibiotic course successfully. Lungs clear on follow-up.',
 'NORMAL',
 CURRENT_DATE - INTERVAL '120 days');

-- Liver - UNDER_TREATMENT (active red marker on abdomen)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Amit' AND last_name = 'Patel'),
 (SELECT id FROM organs WHERE name = 'liver'),
 'Non-Alcoholic Fatty Liver Disease Grade 1. Mildly elevated ALT 52 U/L. Ultrasound shows mild hepatic steatosis.',
 'Vitamin E 400 IU (daily), Weight management program, Mediterranean diet recommended',
 'Incidental finding on abdominal ultrasound. Liver enzymes mildly elevated. No fibrosis on FibroScan. Advised dietary changes, regular exercise, and weight loss of 5-7kg. Recheck LFTs in 3 months.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '5 days');

-- Eyes - UNDER_TREATMENT (active marker on head, but brain was NORMAL so head should show active for eyes)
INSERT INTO medical_records (patient_id, doctor_id, organ_id, diagnosis, prescriptions, clinical_notes, treatment_status, record_date) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM doctors WHERE first_name = 'Suresh' AND last_name = 'Kumar'),
 (SELECT id FROM organs WHERE name = 'eyes'),
 'Early dry eye syndrome with mild corneal dryness. Schirmer test: 8mm (borderline low). No structural damage.',
 'Artificial tears (preservative-free) 4 times daily, Omega-3 fatty acid supplements 1000mg daily, Reduce screen time',
 'Patient reports persistent eye dryness and strain especially during prolonged computer use. Tear film breakup time reduced. No evidence of keratitis. Monitor response to artificial tears.',
 'UNDER_TREATMENT',
 CURRENT_DATE - INTERVAL '14 days');
