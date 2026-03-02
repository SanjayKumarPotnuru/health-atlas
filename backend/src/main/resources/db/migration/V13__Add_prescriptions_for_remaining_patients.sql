-- V13: Add detailed prescriptions for remaining 6 patients (patient_id 5-10)
-- Each prescription is medically accurate and tailored to the patient's condition

-- =====================================================================================
-- Prescription 5: Rohit Malhotra (patient_id=5) - Bilateral Renal Calculi (Kidney Stones)
-- Treating Doctor: Dr. Suresh Kumar (doctor_id=5, General Medicine)
-- =====================================================================================
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis,
    vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes,
    follow_up_date, follow_up_notes, prescription_date)
VALUES (5, 5, 'NORMAL',
    'Severe colicky pain in right flank radiating to groin since 2 days. Episode of gross hematuria this morning. History of inadequate water intake.',
    'Bilateral Renal Calculi - Right 8mm upper calyx, Left 5mm mid-calyx',
    '140/90', '26.8', '99.1°F', '92 bpm',
    'CT KUB confirms bilateral stones. Right stone 8mm in upper calyx — borderline for spontaneous passage. Left stone 5mm likely passable with medical expulsive therapy. Urine routine: RBCs 25-30/hpf. Serum creatinine 1.1 mg/dL (normal). Patient counselled on hydration (3.5-4L water/day), low oxalate diet. Avoid spinach, tomatoes, nuts, chocolate. Reduce sodium intake. Lemon water recommended.',
    '2026-03-07', 'Repeat CT KUB to assess stone passage. Review urine analysis. If right stone persists, plan ESWL (lithotripsy).',
    '2026-02-14');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(5, 1, 'URIMAX', 'TAMSULOSIN HYDROCHLORIDE', '0.4MG', '0-0-1', 'ORAL', 'After Dinner', '4 Weeks', 'Medical expulsive therapy to relax ureter and facilitate stone passage'),
(5, 2, 'VOVERAN SR', 'DICLOFENAC SODIUM (SUSTAINED RELEASE)', '100MG', 'SOS', 'ORAL', 'After Food', 'As Needed', 'For acute renal colic pain. Max 2 tablets/day. Do not exceed 5 days continuously'),
(5, 3, 'DROTIN-DS', 'DROTAVERINE HYDROCHLORIDE', '80MG', '1-0-1', 'ORAL', 'After Food', '2 Weeks', 'Antispasmodic for ureteric smooth muscle relaxation'),
(5, 4, 'K-CIT', 'POTASSIUM CITRATE + CITRIC ACID', '1100MG', '1-1-1', 'ORAL', 'After Food', '4 Weeks', 'Dissolve in half glass of water. Helps alkalinize urine and prevent calcium oxalate stone formation'),
(5, 5, 'PAN-D', 'PANTOPRAZOLE 40MG + DOMPERIDONE 30MG', NULL, '1-0-0', 'ORAL', 'Before Breakfast', '2 Weeks', 'Gastric protection while on Diclofenac');

-- =====================================================================================
-- Prescription 6: Divya Nair (patient_id=6) - Acute Bronchitis with LRTI
-- Treating Doctor: Dr. Suresh Kumar (doctor_id=5, General Medicine)
-- =====================================================================================
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis,
    vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes,
    follow_up_date, follow_up_notes, prescription_date)
VALUES (6, 5, 'NORMAL',
    'Persistent productive cough with yellowish-green sputum for 2 weeks. Low-grade fever on and off. Chest tightness and mild breathlessness on exertion. No history of asthma.',
    'Acute Bronchitis with Lower Respiratory Tract Infection',
    '118/76', '23.5', '100.2°F', '96 bpm',
    'Bilateral rhonchi heard on auscultation. No crepitations. SpO2: 96% on room air. Chest X-ray shows increased bronchovascular markings, no consolidation or effusion. Sputum culture sent. CBC shows mild leukocytosis (WBC 12,400). CRP elevated at 18 mg/L. Steam inhalation 3 times daily recommended. Avoid cold beverages, dust, smoke exposure. Deep breathing exercises demonstrated.',
    '2026-02-26', 'Review sputum culture report. Reassess if symptoms persist or worsen. Consider PFT if wheezing continues.',
    '2026-02-16');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(6, 1, 'AZEE', 'AZITHROMYCIN', '500MG', '1-0-0', 'ORAL', 'Before Breakfast', '5 Days', 'Day 1: 500mg, Day 2-5: 250mg. Take on empty stomach 1 hour before meal'),
(6, 2, 'ASTHALIN INHALER', 'SALBUTAMOL (100MCG/PUFF)', '2 PUFFS', '1-1-1', 'INHALATION', 'As Needed', '2 Weeks', 'Use spacer if available. Rinse mouth after use. Max 8 puffs/day'),
(6, 3, 'AMBRODIL-S SYRUP', 'AMBROXOL 30MG + LEVOSALBUTAMOL 1MG/5ML', '10ML', '1-1-1', 'ORAL', 'After Food', '10 Days', 'Mucolytic and bronchodilator combination'),
(6, 4, 'MONTEK-LC', 'MONTELUKAST 10MG + LEVOCETIRIZINE 5MG', NULL, '0-0-1', 'ORAL', 'After Dinner', '2 Weeks', 'For bronchospasm and allergic component. May cause drowsiness'),
(6, 5, 'DOLO', 'PARACETAMOL', '650MG', 'SOS', 'ORAL', 'After Food', 'As Needed', 'For fever above 100°F. Minimum 6 hour gap between doses. Max 4 tablets/day'),
(6, 6, 'FORACORT INHALER', 'BUDESONIDE 200MCG + FORMOTEROL 6MCG', '1 PUFF', '1-0-1', 'INHALATION', 'Not Applicable', '2 Weeks', 'Maintenance inhaler. Rinse mouth thoroughly after each use to prevent oral thrush');

-- =====================================================================================
-- Prescription 7: Karthik Rao (patient_id=7) - Non-Alcoholic Fatty Liver Disease (NAFLD)
-- Treating Doctor: Dr. Amit Patel (doctor_id=3, Gastroenterology)
-- =====================================================================================
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis,
    vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes,
    follow_up_date, follow_up_notes, prescription_date)
VALUES (7, 3, 'NORMAL',
    'Upper abdominal heaviness and fullness after meals for past 3 months. Fatigue and lethargy. Known to have high triglycerides. No alcohol history.',
    'Non-Alcoholic Fatty Liver Disease (NAFLD) - Grade 2 with early NASH',
    '136/88', '30.5', '98.4°F', '78 bpm',
    'USG Abdomen: Moderate hepatic steatosis (Grade 2), hepatomegaly (liver span 16.5cm). LFT: ALT 78 U/L (H), AST 65 U/L (H), GGT 58 U/L (H), ALP 95 U/L. Lipid profile: TG 285 mg/dL, LDL 168 mg/dL. FibroScan score 7.2 kPa (F1-F2 fibrosis). No ascites or portal hypertension. Patient counselled extensively on weight reduction target of 10% over 6 months. Mediterranean-style diet recommended. Daily 45 min brisk walking. Absolute alcohol avoidance. Avoid fructose-rich beverages and processed foods.',
    '2026-05-01', 'Repeat LFT, lipid panel, HbA1c. Follow-up USG abdomen. Assess weight loss progress.',
    '2026-02-01');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(7, 1, 'UDILIV', 'URSODEOXYCHOLIC ACID', '300MG', '1-0-1', 'ORAL', 'After Food', '3 Months', 'Hepatoprotective. Helps improve bile flow and reduce liver inflammation'),
(7, 2, 'EVION', 'VITAMIN E (TOCOPHEROL ACETATE)', '400IU', '0-1-0', 'ORAL', 'After Lunch', '3 Months', 'Antioxidant therapy for NASH. Proven to reduce hepatic steatosis and inflammation'),
(7, 3, 'SILYBON', 'SILYMARIN (MILK THISTLE EXTRACT)', '140MG', '1-1-1', 'ORAL', 'After Food', '3 Months', 'Hepatoprotective supplement. Supports liver cell regeneration'),
(7, 4, 'PENTOXIFYLLINE SR', 'PENTOXIFYLLINE', '400MG', '1-0-1', 'ORAL', 'After Food', '3 Months', 'Anti-inflammatory for liver. Reduces TNF-alpha levels in NASH'),
(7, 5, 'ROSUVASTATIN', NULL, '10MG', '0-0-1', 'ORAL', 'After Dinner', '3 Months', 'For dyslipidemia. Safe in NAFLD. Monitor LFT if any muscle pain'),
(7, 6, 'SAROGLITAZAR (LIPAGLYN)', NULL, '4MG', '1-0-0', 'ORAL', 'Before Breakfast', '3 Months', 'PPAR alpha/gamma agonist specifically approved for NAFLD with dyslipidemia in India');

-- =====================================================================================
-- Prescription 8: Neha Gupta (patient_id=8) - Primary Hypothyroidism
-- Treating Doctor: Dr. Suresh Kumar (doctor_id=5, General Medicine)
-- =====================================================================================
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis,
    vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes,
    follow_up_date, follow_up_notes, prescription_date)
VALUES (8, 5, 'NORMAL',
    'Progressive fatigue and lethargy for 3 months. Unintentional weight gain of 5 kg. Cold intolerance. Constipation and dry skin. Hair thinning noticed recently. Irregular menstrual cycles (oligomenorrhea).',
    'Primary Hypothyroidism - Hashimoto Thyroiditis',
    '106/68', '27.8', '97.4°F', '58 bpm',
    'TSH: 12.5 mIU/L (elevated), Free T4: 0.6 ng/dL (low), Free T3: 1.8 pg/mL (low-normal). Anti-TPO antibodies: 380 IU/mL (strongly positive - confirms Hashimoto). CBC: Hb 10.8 g/dL (mild anemia). Serum Vitamin D: 14 ng/mL (deficient). Vitamin B12: 180 pg/mL (borderline low). Lipid panel: mildly elevated LDL at 145 mg/dL (secondary to hypothyroidism). Thyroid USG: diffusely enlarged gland with heterogeneous echotexture, no nodules. Started on levothyroxine with plan to uptitrate. Patient educated: take thyroid medication on empty stomach, 30 min before food. Avoid calcium/iron within 4 hours of thyroxine.',
    '2026-04-04', 'Recheck TSH, FT4 after 6 weeks. Assess symptom improvement. Adjust thyroxine dose if needed. Repeat CBC and Vitamin D.',
    '2026-02-09');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(8, 1, 'THYRONORM', 'LEVOTHYROXINE SODIUM', '75MCG', '1-0-0', 'ORAL', 'Empty Stomach (30 min before breakfast)', 'Ongoing', 'Take first thing in morning with plain water. Do NOT take with milk, tea, coffee, or calcium/iron supplements. Wait 30 min before eating'),
(8, 2, 'SHELCAL-HD', 'CALCIUM CARBONATE 500MG + VITAMIN D3 1000IU', NULL, '0-0-1', 'ORAL', 'After Dinner', '3 Months', 'Must be taken at least 4 hours AFTER thyroxine to avoid absorption interference'),
(8, 3, 'ARACHITOL NANO', 'CHOLECALCIFEROL (VITAMIN D3)', '60000IU', '1 SACHET WEEKLY', 'ORAL', 'After Lunch (any day)', '8 Weeks', 'Weekly mega-dose for vitamin D deficiency correction. Take with fatty meal for better absorption'),
(8, 4, 'OROFER-XT', 'FERROUS ASCORBATE 100MG + FOLIC ACID 1.5MG', NULL, '0-1-0', 'ORAL', 'After Lunch', '2 Months', 'Iron supplement for anemia. Take 4 hours apart from thyroxine. May cause dark stools — this is normal'),
(8, 5, 'METHYLCOBALAMIN (MECONERV)', 'METHYLCOBALAMIN', '1500MCG', '0-1-0', 'ORAL', 'After Lunch', '2 Months', 'Active form of Vitamin B12 for borderline deficiency. Better absorbed than cyanocobalamin'),
(8, 6, 'CREMAFFIN PLUS', 'LIQUID PARAFFIN + MILK OF MAGNESIA + SODIUM PICOSULPHATE', '10ML', '0-0-1', 'ORAL', 'At Bedtime', '2 Weeks', 'Gentle laxative for constipation secondary to hypothyroidism. Taper off as thyroid levels normalize');

-- =====================================================================================
-- Prescription 9: Aditya Chopra (patient_id=9) - Diabetic Retinopathy with Poorly Controlled T2DM
-- Treating Doctor: Dr. Suresh Kumar (doctor_id=5, General Medicine)
-- =====================================================================================
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis,
    vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes,
    follow_up_date, follow_up_notes, prescription_date)
VALUES (9, 5, 'FOLLOW-UP',
    'Blurred vision in both eyes for past 6 weeks, progressively worsening. Known Type 2 Diabetic for 8 years. Tingling and numbness in feet. Recent HbA1c was 9.8%.',
    'Moderate Non-Proliferative Diabetic Retinopathy with Diabetic Peripheral Neuropathy, T2DM - Poorly Controlled',
    '148/92', '29.4', '98.6°F', '82 bpm',
    'Fundoscopy: bilateral dot-blot hemorrhages, microaneurysms, hard exudates in both eyes. No neovascularization (NPDR). Visual acuity: R-6/12, L-6/9. FBS: 198 mg/dL, PPBS: 312 mg/dL, HbA1c: 9.8%. Serum creatinine: 1.2 mg/dL. Urine microalbumin: 45 mg/L (early nephropathy). Monofilament test: reduced sensation in both feet. Patient has been on only oral medications — inadequate control. Intensifying therapy with basal insulin. Referred to Ophthalmology for possible laser photocoagulation. Strict glycemic targets: FBS <130, PPBS <180, HbA1c <7%. Diabetic foot care education reinforced. Daily foot inspection mandatory.',
    '2026-03-21', 'Review HbA1c after 3 months. Ophthalmology follow-up report. Reassess insulin dose. Repeat urine microalbumin.',
    '2026-02-18');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(9, 1, 'LANTUS SOLOSTAR', 'INSULIN GLARGINE', '14 UNITS', '0-0-1', 'SUBCUTANEOUS INJECTION', 'At Bedtime (fixed time)', 'Ongoing', 'Basal insulin. Inject in abdomen or thigh. Rotate injection sites. Store in refrigerator. Titrate by 2 units every 3 days if FBS >130'),
(9, 2, 'VOGLIBOSE (VOLIX)', NULL, '0.3MG', '1-1-1', 'ORAL', 'Before Food (with first bite)', '30 Days', 'Alpha-glucosidase inhibitor to control post-meal sugar spikes. May cause flatulence initially'),
(9, 3, 'JALRA-M', 'VILDAGLIPTIN 50MG + METFORMIN 1000MG', NULL, '1-0-1', 'ORAL', 'After Food', '30 Days', 'Combination DPP-4 inhibitor + Metformin. Continue previous Metformin replaced with this combination'),
(9, 4, 'PREGABALIN (PREGALIN)', NULL, '75MG', '0-0-1', 'ORAL', 'After Dinner', '30 Days', 'For diabetic peripheral neuropathy pain and tingling. May cause dizziness initially — avoid driving'),
(9, 5, 'METHYLCOBALAMIN INJECTION', 'METHYLCOBALAMIN', '1500MCG', 'WEEKLY x 8', 'INTRAMUSCULAR', 'Any Time', '8 Weeks', 'For peripheral neuropathy. Weekly IM injection for 8 weeks, then switch to oral maintenance'),
(9, 6, 'NEPAFENAC EYE DROPS (NEVANAC)', 'NEPAFENAC 0.1%', '1 DROP', '1-1-1', 'OPHTHALMIC', 'Not Applicable', '4 Weeks', 'NSAID eye drop for diabetic macular inflammation. Shake well before use. One drop in each eye'),
(9, 7, 'TELMISARTAN', NULL, '40MG', '1-0-0', 'ORAL', 'Before Breakfast', '30 Days', 'For BP control and renoprotective effect (early nephropathy). ARBs reduce microalbuminuria');

-- =====================================================================================
-- Prescription 10: Pooja Bhatt (patient_id=10) - Moderate Psoriasis Vulgaris
-- Treating Doctor: Dr. Suresh Kumar (doctor_id=5, General Medicine)
-- =====================================================================================
INSERT INTO prescriptions (patient_id, doctor_id, visit_type, chief_complaint, final_diagnosis,
    vitals_bp, vitals_bmi, vitals_temperature, vitals_pulse, clinical_notes,
    follow_up_date, follow_up_notes, prescription_date)
VALUES (10, 5, 'NORMAL',
    'Itchy, scaly, erythematous plaques on elbows, knees, lower back, and scalp for past 4 months. Recently worsened after a stressful period at work. Nail changes noticed. No joint pains.',
    'Chronic Plaque Psoriasis Vulgaris - Moderate (PASI Score: 14.2, BSA: 15%)',
    '122/78', '25.6', '98.4°F', '74 bpm',
    'Well-defined erythematous plaques with silvery-white scales over bilateral elbows, knees, lower back (sacral area), and scalp. Auspitz sign positive. Nail pitting present in 4 fingernails. Koebner phenomenon noted at scratch marks. No psoriatic arthritis features. Skin biopsy confirms psoriasis vulgaris. PASI 14.2 — moderate severity warrants systemic therapy. BSA approximately 15%. Patient counselled: chronic condition requiring long-term management, avoid skin injury/trauma, manage stress (yoga/meditation recommended), moisturize frequently, avoid triggers (alcohol, smoking, stress). Baseline LFT, CBC, renal function done before starting Methotrexate.',
    '2026-03-18', 'Review LFT and CBC (Methotrexate monitoring). Assess PASI improvement. Consider dose adjustment.',
    '2026-02-04');

INSERT INTO prescription_medicines (prescription_id, serial_number, medicine_name, generic_name, dosage, frequency, route, timing, duration, instructions)
VALUES
(10, 1, 'FOLITRAX', 'METHOTREXATE', '15MG', 'ONCE WEEKLY (every Saturday)', 'ORAL', 'After Dinner', '3 Months', 'ONLY take on the designated day (Saturday). Never take daily — this is a weekly medication. Monitor for mouth ulcers, nausea, fatigue'),
(10, 2, 'FOLVITE', 'FOLIC ACID', '5MG', 'ONCE WEEKLY (every Monday)', 'ORAL', 'After Lunch', '3 Months', 'Take 48 hours AFTER Methotrexate dose. Reduces MTX side effects like nausea and mouth ulcers'),
(10, 3, 'TENOVATE CREAM', 'CLOBETASOL PROPIONATE 0.05%', NULL, '1-0-1', 'LOCAL APPLICATION', 'Not Applicable', '4 Weeks', 'Apply thin layer on body plaques (elbows, knees, back) only. Avoid face and folds. Do not use for more than 4 weeks continuously — taper gradually'),
(10, 4, 'DAIVONEX OINTMENT', 'CALCIPOTRIOL 0.005%', NULL, '1-0-1', 'LOCAL APPLICATION', 'Not Applicable', '3 Months', 'Vitamin D3 analogue. Apply on plaques. Can be used as steroid-sparing maintenance after Tenovate is tapered. Avoid on face'),
(10, 5, 'TARSHINE SHAMPOO', 'COAL TAR 1% + SALICYLIC ACID 3%', NULL, 'Alternate Days', 'LOCAL APPLICATION (SCALP)', 'Not Applicable', '3 Months', 'Apply on wet scalp, leave for 5 minutes, then rinse. Helps descale and reduce scalp psoriasis. May discolor light hair temporarily'),
(10, 6, 'VENUSIA MAX CREAM', 'CERAMIDE + HYALURONIC ACID + VITAMIN E', NULL, '1-1-1', 'LOCAL APPLICATION', 'After Bath', 'Ongoing', 'Intensive moisturizer. Apply liberally on entire body after every bath. Keeping skin moisturized reduces flare-ups and itching'),
(10, 7, 'ATARAX', 'HYDROXYZINE HYDROCHLORIDE', '25MG', '0-0-1', 'ORAL', 'At Bedtime', '2 Weeks', 'Antihistamine for intense itching. Also helps with sleep. Causes drowsiness — do not drive after taking'),
(10, 8, 'ONDANSETRON (EMESET)', NULL, '4MG', 'SOS', 'ORAL', 'Before Methotrexate', 'As Needed', 'Take 30 min before Methotrexate if nausea occurs on MTX days. Only as needed');
