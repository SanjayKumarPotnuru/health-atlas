-- V10__Add_sample_patient_documents.sql
-- Add sample PDF document uploads for patients based on their medical conditions

-- Patient 1: Arjun Menon - Fractured leg documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM organs WHERE name = 'bones'),
 'Left Femur X-Ray - Pre-Surgery',
 'sample_xray_femur_presurgery.pdf',
 'application/pdf',
 2458320,
 'X-ray imaging showing compound fracture of left femur mid-shaft before surgical intervention',
 true,
 CURRENT_DATE - INTERVAL '15 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM organs WHERE name = 'bones'),
 'Post-Surgery X-Ray Report',
 'sample_xray_femur_postsurgery.pdf',
 'application/pdf',
 1876543,
 'Post-operative X-ray showing successful internal fixation with plates and screws',
 true,
 CURRENT_DATE - INTERVAL '14 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 (SELECT id FROM organs WHERE name = 'bones'),
 'Surgery Discharge Summary',
 'sample_discharge_summary_ortho.pdf',
 'application/pdf',
 567890,
 'Hospital discharge documentation with post-operative care instructions and follow-up schedule',
 true,
 CURRENT_DATE - INTERVAL '13 days');

-- Patient 2: Sneha Iyer - Heart condition documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM organs WHERE name = 'heart'),
 'ECG Report - Atrial Fibrillation Diagnosis',
 'sample_ecg_afib_diagnosis.pdf',
 'application/pdf',
 987654,
 'Electrocardiogram showing irregular rhythm consistent with atrial fibrillation',
 true,
 CURRENT_DATE - INTERVAL '30 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM organs WHERE name = 'heart'),
 'Echocardiogram Report',
 'sample_echo_cardiac_function.pdf',
 'application/pdf',
 3456789,
 'Echocardiogram showing ejection fraction of 45% and chamber dimensions',
 true,
 CURRENT_DATE - INTERVAL '28 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 (SELECT id FROM organs WHERE name = 'heart'),
 'Blood Test - Coagulation Profile',
 'sample_blood_coagulation_test.pdf',
 'application/pdf',
 456123,
 'Coagulation studies for anticoagulation therapy monitoring',
 true,
 CURRENT_DATE - INTERVAL '7 days');

-- Patient 3: Vikram Desai - Stomach ulcer documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Vikram' AND last_name = 'Desai'),
 (SELECT id FROM organs WHERE name = 'stomach'),
 'Endoscopy Report - Peptic Ulcer',
 'sample_endoscopy_peptic_ulcer.pdf',
 'application/pdf',
 4567890,
 'Upper GI endoscopy findings showing multiple gastric ulcers with biopsy results',
 true,
 CURRENT_DATE - INTERVAL '10 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Vikram' AND last_name = 'Desai'),
 (SELECT id FROM organs WHERE name = 'stomach'),
 'H. Pylori Test Results',
 'sample_hpylori_test_positive.pdf',
 'application/pdf',
 234567,
 'Laboratory confirmation of H. pylori infection - positive result',
 true,
 CURRENT_DATE - INTERVAL '10 days');

-- Patient 4: Ananya Krishnan - Migraine documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Ananya' AND last_name = 'Krishnan'),
 (SELECT id FROM organs WHERE name = 'brain'),
 'MRI Brain Scan Report',
 'sample_mri_brain_normal.pdf',
 'application/pdf',
 5678901,
 'Brain MRI showing no structural abnormalities, ruling out secondary causes of headache',
 true,
 CURRENT_DATE - INTERVAL '45 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Ananya' AND last_name = 'Krishnan'),
 (SELECT id FROM organs WHERE name = 'brain'),
 'Headache Diary - Monthly Log',
 'sample_headache_diary.pdf',
 'application/pdf',
 345678,
 'Patient-maintained headache diary tracking frequency, severity, and triggers',
 false,
 CURRENT_DATE - INTERVAL '5 days');

-- Patient 5: Rohit Malhotra - Kidney stones documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 (SELECT id FROM organs WHERE name = 'kidneys'),
 'CT Scan - Kidney Stones',
 'sample_ct_kidney_stones.pdf',
 'application/pdf',
 6789012,
 'Non-contrast CT scan showing bilateral renal calculi with measurements',
 true,
 CURRENT_DATE - INTERVAL '7 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 (SELECT id FROM organs WHERE name = 'kidneys'),
 'Urine Analysis Report',
 'sample_urine_analysis_hematuria.pdf',
 'application/pdf',
 234890,
 'Urinalysis showing microscopic hematuria and crystals consistent with kidney stones',
 true,
 CURRENT_DATE - INTERVAL '7 days');

-- Patient 6: Divya Nair - Lung infection documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Divya' AND last_name = 'Nair'),
 (SELECT id FROM organs WHERE name = 'lungs'),
 'Chest X-Ray - Bronchitis',
 'sample_chest_xray_bronchitis.pdf',
 'application/pdf',
 2345671,
 'Chest X-ray showing increased bronchovascular markings, no consolidation',
 true,
 CURRENT_DATE - INTERVAL '5 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Divya' AND last_name = 'Nair'),
 (SELECT id FROM organs WHERE name = 'lungs'),
 'Pulmonary Function Test Results',
 'sample_pft_results.pdf',
 'application/pdf',
 567234,
 'Spirometry results showing mild obstructive pattern during acute infection',
 true,
 CURRENT_DATE - INTERVAL '4 days');

-- Patient 7: Karthik Rao - Liver disease documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Karthik' AND last_name = 'Rao'),
 (SELECT id FROM organs WHERE name = 'liver'),
 'Liver Ultrasound Report',
 'sample_ultrasound_fatty_liver.pdf',
 'application/pdf',
 3456712,
 'Abdominal ultrasound showing moderate hepatic steatosis consistent with NAFLD',
 true,
 CURRENT_DATE - INTERVAL '20 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Karthik' AND last_name = 'Rao'),
 (SELECT id FROM organs WHERE name = 'liver'),
 'Liver Function Test - Elevated Enzymes',
 'sample_lft_elevated.pdf',
 'application/pdf',
 234561,
 'Blood work showing elevated ALT and AST levels indicative of liver inflammation',
 true,
 CURRENT_DATE - INTERVAL '20 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Karthik' AND last_name = 'Rao'),
 (SELECT id FROM organs WHERE name = 'liver'),
 'Metabolic Panel Report',
 'sample_metabolic_panel.pdf',
 'application/pdf',
 456234,
 'Comprehensive metabolic panel showing lipid profile and glucose levels',
 true,
 CURRENT_DATE - INTERVAL '20 days');

-- Patient 8: Neha Gupta - Thyroid documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Neha' AND last_name = 'Gupta'),
 (SELECT id FROM organs WHERE name = 'thyroid'),
 'Thyroid Function Test - TSH Elevated',
 'sample_thyroid_tsh_elevated.pdf',
 'application/pdf',
 345612,
 'Lab results showing elevated TSH and low Free T4 confirming hypothyroidism',
 true,
 CURRENT_DATE - INTERVAL '12 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Neha' AND last_name = 'Gupta'),
 (SELECT id FROM organs WHERE name = 'thyroid'),
 'Thyroid Ultrasound Report',
 'sample_thyroid_ultrasound.pdf',
 'application/pdf',
 2567890,
 'Thyroid ultrasound showing slightly enlarged gland with normal echotexture',
 true,
 CURRENT_DATE - INTERVAL '12 days');

-- Patient 9: Aditya Chopra - Eye/Diabetic documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Aditya' AND last_name = 'Chopra'),
 (SELECT id FROM organs WHERE name = 'eyes'),
 'Retinal Scan - Diabetic Retinopathy',
 'sample_retinal_scan_dr.pdf',
 'application/pdf',
 4567123,
 'Fundus photography showing microaneurysms and hemorrhages in both eyes',
 true,
 CURRENT_DATE - INTERVAL '25 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Aditya' AND last_name = 'Chopra'),
 (SELECT id FROM organs WHERE name = 'eyes'),
 'OCT Scan Results',
 'sample_oct_macula.pdf',
 'application/pdf',
 3456123,
 'Optical Coherence Tomography of macula showing early diabetic changes',
 true,
 CURRENT_DATE - INTERVAL '25 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Aditya' AND last_name = 'Chopra'),
 NULL,
 'HbA1c Blood Test Report',
 'sample_hba1c_diabetic.pdf',
 'application/pdf',
 234567,
 'Glycated hemoglobin test showing poor diabetes control at 9.2%',
 true,
 CURRENT_DATE - INTERVAL '26 days');

-- Patient 10: Pooja Bhatt - Skin condition documents
INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 (SELECT id FROM organs WHERE name = 'skin'),
 'Skin Biopsy Pathology Report',
 'sample_skin_biopsy_psoriasis.pdf',
 'application/pdf',
 1234567,
 'Histopathology report confirming psoriasis vulgaris diagnosis',
 true,
 CURRENT_DATE - INTERVAL '18 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 (SELECT id FROM organs WHERE name = 'skin'),
 'Pre-Treatment Photographs',
 'sample_psoriasis_photos.pdf',
 'application/pdf',
 2345678,
 'Clinical photographs documenting extent and severity of psoriatic plaques',
 false,
 CURRENT_DATE - INTERVAL '18 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Pooja' AND last_name = 'Bhatt'),
 NULL,
 'Liver Function Test - Baseline for Methotrexate',
 'sample_lft_baseline.pdf',
 'application/pdf',
 345678,
 'Baseline liver function tests before starting methotrexate therapy',
 true,
 CURRENT_DATE - INTERVAL '19 days');

-- Additional general health documents for various patients

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Sneha' AND last_name = 'Iyer'),
 NULL,
 'Annual Health Checkup Report 2025',
 'sample_annual_checkup_2025.pdf',
 'application/pdf',
 1567890,
 'Comprehensive annual health examination including blood work and vital signs',
 true,
 CURRENT_DATE - INTERVAL '180 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Rohit' AND last_name = 'Malhotra'),
 NULL,
 'Vaccination Record - COVID-19',
 'sample_vaccination_covid.pdf',
 'application/pdf',
 456789,
 'COVID-19 vaccination certificate showing completed primary series and booster',
 true,
 CURRENT_DATE - INTERVAL '365 days');

INSERT INTO patient_uploads (patient_id, organ_id, document_name, file_path, file_type, file_size, description, is_verified, uploaded_at) VALUES
((SELECT id FROM patients WHERE first_name = 'Arjun' AND last_name = 'Menon'),
 NULL,
 'Insurance Pre-Authorization Letter',
 'sample_insurance_preauth.pdf',
 'application/pdf',
 678901,
 'Health insurance approval letter for surgical procedure',
 true,
 CURRENT_DATE - INTERVAL '16 days');
