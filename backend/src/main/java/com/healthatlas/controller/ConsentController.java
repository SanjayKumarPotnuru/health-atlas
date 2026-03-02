package com.healthatlas.controller;

import com.healthatlas.dto.ConsentRequestDTO;
import com.healthatlas.dto.ConsentResponseDTO;
import com.healthatlas.model.Consent;
import com.healthatlas.model.Patient;
import com.healthatlas.repository.ConsentRepository;
import com.healthatlas.repository.PatientRepository;
import com.healthatlas.service.ConsentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsentController {

    private final ConsentService consentService;
    private final PatientRepository patientRepository;
    private final ConsentRepository consentRepository;

    // Doctor requests consent
    @PostMapping("/doctor/{doctorId}/consent/request")
    public ResponseEntity<ConsentResponseDTO> requestConsent(
            @PathVariable Long doctorId,
            @Valid @RequestBody ConsentRequestDTO request) {
        ConsentResponseDTO response = consentService.requestConsent(doctorId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Doctor views their consent requests
    @GetMapping("/doctor/{doctorId}/consents")
    public ResponseEntity<List<ConsentResponseDTO>> getDoctorConsents(
            @PathVariable Long doctorId) {
        List<ConsentResponseDTO> consents = consentService.getDoctorConsents(doctorId);
        return ResponseEntity.ok(consents);
    }

    // Patient views consent requests
    @GetMapping("/patient/{patientId}/consents")
    public ResponseEntity<List<ConsentResponseDTO>> getPatientConsents(
            @PathVariable Long patientId) {
        List<ConsentResponseDTO> consents = consentService.getPatientConsents(patientId);
        return ResponseEntity.ok(consents);
    }

    // Patient approves consent
    @PutMapping("/patient/{patientId}/consent/{consentId}/approve")
    public ResponseEntity<ConsentResponseDTO> approveConsent(
            @PathVariable Long patientId,
            @PathVariable Long consentId) {
        ConsentResponseDTO response = consentService.approveConsent(patientId, consentId);
        return ResponseEntity.ok(response);
    }

    // Patient revokes consent
    @PutMapping("/patient/{patientId}/consent/{consentId}/revoke")
    public ResponseEntity<Void> revokeConsent(
            @PathVariable Long patientId,
            @PathVariable Long consentId) {
        consentService.revokeConsent(patientId, consentId);
        return ResponseEntity.noContent().build();
    }

    // Doctor gets list of patient emails with consent status
    @GetMapping("/doctor/{doctorId}/patients")
    public ResponseEntity<List<Map<String, Object>>> getPatientEmails(@PathVariable Long doctorId) {
        List<Patient> patients = patientRepository.findAll();
        List<Consent> doctorConsents = consentRepository.findByDoctorId(doctorId);
        
        List<Map<String, Object>> patientData = patients.stream()
                .map(patient -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", patient.getId());
                    data.put("email", patient.getUser().getEmail());
                    data.put("name", patient.getFirstName() + " " + patient.getLastName());
                    
                    // Check if there's a consent with this patient
                    doctorConsents.stream()
                        .filter(c -> c.getPatient().getId().equals(patient.getId()))
                        .findFirst()
                        .ifPresent(consent -> {
                            data.put("consentStatus", consent.getStatus().toString());
                            data.put("consentType", consent.getConsentType().toString());
                        });
                    
                    return data;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(patientData);
    }
}
