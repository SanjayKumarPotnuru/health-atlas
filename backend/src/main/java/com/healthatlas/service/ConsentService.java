package com.healthatlas.service;

import com.healthatlas.dto.ConsentRequestDTO;
import com.healthatlas.dto.ConsentResponseDTO;
import com.healthatlas.exception.DuplicateResourceException;
import com.healthatlas.exception.ResourceNotFoundException;
import com.healthatlas.exception.UnauthorizedException;
import com.healthatlas.model.Consent;
import com.healthatlas.model.Doctor;
import com.healthatlas.model.Patient;
import com.healthatlas.repository.ConsentRepository;
import com.healthatlas.repository.DoctorRepository;
import com.healthatlas.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsentService {

    private final ConsentRepository consentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public ConsentResponseDTO requestConsent(Long doctorId, ConsentRequestDTO request) {
        // Get doctor
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Get patient by email
        Patient patient = patientRepository.findByUser_Email(request.getPatientEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Patient with email " + request.getPatientEmail() + " not found"));

        // Check if there's already an active consent
        consentRepository.findActiveConsentByPatientAndDoctor(patient.getId(), doctor.getId())
                .ifPresent(consent -> {
                    throw new DuplicateResourceException("Active consent already exists");
                });

        // Create consent request
        Consent consent = new Consent();
        consent.setPatient(patient);
        consent.setDoctor(doctor);
        consent.setConsentType(Consent.ConsentType.valueOf(request.getConsentType()));
        consent.setStatus(Consent.ConsentStatus.PENDING);
        consent.setRequestedAt(LocalDateTime.now());

        consent = consentRepository.save(consent);

        return mapToDTO(consent);
    }

    @Transactional
    public ConsentResponseDTO approveConsent(Long patientId, Long consentId) {
        // Get consent
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));

        // Verify patient owns the consent
        if (!consent.getPatient().getId().equals(patientId)) {
            throw new UnauthorizedException("You are not authorized to approve this consent");
        }

        // Verify consent is pending
        if (consent.getStatus() != Consent.ConsentStatus.PENDING) {
            throw new IllegalStateException("Consent is not in pending status");
        }

        // Approve consent
        consent.setStatus(Consent.ConsentStatus.APPROVED);
        consent.setApprovedAt(LocalDateTime.now());

        // Set expiry time based on consent type
        LocalDateTime expiresAt = calculateExpiryTime(consent.getConsentType());
        consent.setExpiresAt(expiresAt);

        consent = consentRepository.save(consent);

        return mapToDTO(consent);
    }

    @Transactional
    public void revokeConsent(Long patientId, Long consentId) {
        // Get consent
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));

        // Verify patient owns the consent
        if (!consent.getPatient().getId().equals(patientId)) {
            throw new UnauthorizedException("You are not authorized to revoke this consent");
        }

        // Revoke consent
        consent.setStatus(Consent.ConsentStatus.REVOKED);
        consent.setRevokedAt(LocalDateTime.now());

        consentRepository.save(consent);
    }

    public List<ConsentResponseDTO> getPatientConsents(Long patientId) {
        List<Consent> consents = consentRepository.findByPatientId(patientId);
        
        // Update expired consents
        consents.forEach(this::updateConsentStatus);
        
        return consents.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ConsentResponseDTO> getDoctorConsents(Long doctorId) {
        List<Consent> consents = consentRepository.findByDoctorId(doctorId);
        
        // Update expired consents
        consents.forEach(this::updateConsentStatus);
        
        return consents.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public boolean hasActiveConsent(Long patientId, Long doctorId) {
        return consentRepository.findActiveConsentByPatientAndDoctor(patientId, doctorId)
                .map(consent -> {
                    updateConsentStatus(consent);
                    return consent.getStatus() == Consent.ConsentStatus.APPROVED;
                })
                .orElse(false);
    }

    private void updateConsentStatus(Consent consent) {
        if (consent.getStatus() == Consent.ConsentStatus.APPROVED
                && consent.getExpiresAt() != null
                && consent.getExpiresAt().isBefore(LocalDateTime.now())) {
            consent.setStatus(Consent.ConsentStatus.EXPIRED);
            consentRepository.save(consent);
        }
    }

    private LocalDateTime calculateExpiryTime(Consent.ConsentType consentType) {
        LocalDateTime now = LocalDateTime.now();
        return switch (consentType) {
            case ONE_TIME -> now.plusHours(1); // 1 hour for one-time access
            case SEVEN_DAYS -> now.plusDays(7);
            case THIRTY_DAYS -> now.plusDays(30);
            case ALWAYS -> null; // No expiry for ALWAYS
        };
    }

    private ConsentResponseDTO mapToDTO(Consent consent) {
        ConsentResponseDTO dto = new ConsentResponseDTO();
        dto.setId(consent.getId());
        dto.setPatientId(consent.getPatient().getId());
        dto.setPatientName(consent.getPatient().getFirstName() + " " + consent.getPatient().getLastName());
        dto.setDoctorId(consent.getDoctor().getId());
        dto.setDoctorName("Dr. " + consent.getDoctor().getFirstName() + " " + consent.getDoctor().getLastName());
        
        // Set nested doctor information
        ConsentResponseDTO.DoctorInfo doctorInfo = new ConsentResponseDTO.DoctorInfo();
        doctorInfo.setId(consent.getDoctor().getId());
        doctorInfo.setFirstName(consent.getDoctor().getFirstName());
        doctorInfo.setLastName(consent.getDoctor().getLastName());
        doctorInfo.setSpecialization(consent.getDoctor().getSpecialization());
        doctorInfo.setHospitalAffiliation(consent.getDoctor().getHospitalAffiliation());
        dto.setDoctor(doctorInfo);
        
        dto.setConsentType(consent.getConsentType().name());
        dto.setStatus(consent.getStatus().name());
        dto.setRequestedAt(consent.getRequestedAt());
        dto.setApprovedAt(consent.getApprovedAt());
        dto.setExpiresAt(consent.getExpiresAt());
        dto.setRevokedAt(consent.getRevokedAt());
        return dto;
    }
}
