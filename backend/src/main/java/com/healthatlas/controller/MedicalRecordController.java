package com.healthatlas.controller;

import com.healthatlas.dto.MedicalRecordRequest;
import com.healthatlas.dto.MedicalRecordResponse;
import com.healthatlas.dto.OrganResponse;
import com.healthatlas.dto.PatientMedicalRecordRequest;
import com.healthatlas.dto.PatientSummaryResponse;
import com.healthatlas.service.MedicalRecordService;
import com.healthatlas.service.OrganService;
import com.healthatlas.service.PatientSummaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final OrganService organService;
    private final PatientSummaryService patientSummaryService;

    // Get all organs (available to all authenticated users)
    @GetMapping("/organs")
    public ResponseEntity<List<OrganResponse>> getAllOrgans() {
        List<OrganResponse> organs = organService.getAllOrgans();
        return ResponseEntity.ok(organs);
    }

    // Doctor adds medical record
    @PostMapping("/doctor/{doctorId}/medical-record")
    public ResponseEntity<MedicalRecordResponse> addMedicalRecord(
            @PathVariable Long doctorId,
            @Valid @RequestBody MedicalRecordRequest request) {
        MedicalRecordResponse response = medicalRecordService.addMedicalRecord(doctorId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Patient adds their own medical record (self-reported)
    @PostMapping("/patient/{patientId}/medical-record")
    public ResponseEntity<MedicalRecordResponse> addPatientMedicalRecord(
            @PathVariable Long patientId,
            @Valid @RequestBody PatientMedicalRecordRequest request) {
        MedicalRecordResponse response = medicalRecordService.addPatientSelfRecord(patientId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Doctor views patient records (requires consent)
    @GetMapping("/doctor/{doctorId}/patient/{patientId}/organ/{organId}/records")
    public ResponseEntity<List<MedicalRecordResponse>> getDoctorAccessibleRecords(
            @PathVariable Long doctorId,
            @PathVariable Long patientId,
            @PathVariable Long organId) {
        List<MedicalRecordResponse> records = medicalRecordService.getDoctorAccessibleRecords(
                doctorId, patientId, organId);
        return ResponseEntity.ok(records);
    }

    // Patient views their own records by organ
    @GetMapping("/patient/{patientId}/organ/{organId}/records")
    public ResponseEntity<List<MedicalRecordResponse>> getPatientRecordsByOrgan(
            @PathVariable Long patientId,
            @PathVariable Long organId) {
        List<MedicalRecordResponse> records = medicalRecordService.getPatientRecordsByOrgan(
                patientId, organId);
        return ResponseEntity.ok(records);
    }

    // Patient views all their records
    @GetMapping("/patient/{patientId}/records")
    public ResponseEntity<List<MedicalRecordResponse>> getAllPatientRecords(
            @PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getAllPatientRecords(patientId);
        return ResponseEntity.ok(records);
    }

    // Doctor views patient details with medical records (requires consent)
    @GetMapping("/doctor/patients/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getDoctorViewPatientRecords(
            @PathVariable Long patientId) {
        // Returns all medical records for the patient
        // Consent checking is handled in the service layer
        List<MedicalRecordResponse> records = medicalRecordService.getAllPatientRecords(patientId);
        return ResponseEntity.ok(records);
    }

    // Doctor or Admin gets comprehensive patient summary (all records, prescriptions, documents, notes)
    @GetMapping("/patient/{patientId}/summary")
    public ResponseEntity<PatientSummaryResponse> getPatientSummary(
            @PathVariable Long patientId) {
        PatientSummaryResponse summary = patientSummaryService.getPatientSummary(patientId);
        return ResponseEntity.ok(summary);
    }
}
