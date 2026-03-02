package com.healthatlas.controller;

import com.healthatlas.dto.PrescriptionRequest;
import com.healthatlas.dto.PrescriptionResponse;
import com.healthatlas.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // Doctor creates a prescription (requires consent)
    @PostMapping("/doctor/{doctorId}/prescription")
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @PathVariable Long doctorId,
            @Valid @RequestBody PrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(doctorId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Doctor views all their prescriptions
    @GetMapping("/doctor/{doctorId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getDoctorPrescriptions(
            @PathVariable Long doctorId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getDoctorPrescriptions(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    // Doctor views prescriptions for a specific patient (requires consent)
    @GetMapping("/doctor/{doctorId}/patient/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getDoctorPatientPrescriptions(
            @PathVariable Long doctorId,
            @PathVariable Long patientId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getDoctorPatientPrescriptions(doctorId, patientId);
        return ResponseEntity.ok(prescriptions);
    }

    // Patient views their own prescriptions
    @GetMapping("/patient/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(
            @PathVariable Long patientId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPatientPrescriptions(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    // Get single prescription details
    @GetMapping("/prescriptions/{prescriptionId}")
    public ResponseEntity<PrescriptionResponse> getPrescription(
            @PathVariable Long prescriptionId) {
        PrescriptionResponse response = prescriptionService.getPrescription(prescriptionId);
        return ResponseEntity.ok(response);
    }

    // Download prescription as PDF
    @GetMapping("/prescriptions/{prescriptionId}/pdf")
    public ResponseEntity<byte[]> downloadPrescriptionPdf(
            @PathVariable Long prescriptionId) {
        PrescriptionResponse prescription = prescriptionService.getPrescription(prescriptionId);
        byte[] pdfBytes = prescriptionService.getPrescriptionPdf(prescriptionId);

        String filename = "Prescription_" + prescription.getPatientName().replace(" ", "_")
                + "_" + prescription.getPrescriptionDate() + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // Admin views all prescriptions
    @GetMapping("/admin/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getAllPrescriptions() {
        List<PrescriptionResponse> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    // Admin views prescriptions for a specific patient
    @GetMapping("/admin/patient/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getAdminPatientPrescriptions(
            @PathVariable Long patientId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPatientPrescriptions(patientId);
        return ResponseEntity.ok(prescriptions);
    }
}
