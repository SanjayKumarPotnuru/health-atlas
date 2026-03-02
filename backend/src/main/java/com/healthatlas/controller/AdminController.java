package com.healthatlas.controller;

import com.healthatlas.dto.ConsentResponseDTO;
import com.healthatlas.model.*;
import com.healthatlas.repository.*;
import com.healthatlas.service.ConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final ConsentService consentService;
    private final ConsentRepository consentRepository;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        
        // Medical records statistics
        long totalRecords = medicalRecordRepository.count();
        long activeRecords = medicalRecordRepository.countByTreatmentStatus(MedicalRecord.TreatmentStatus.UNDER_TREATMENT);
        
        // Consent statistics
        long totalConsents = consentRepository.count();
        long pendingConsents = consentRepository.countByStatus(Consent.ConsentStatus.PENDING);
        long approvedConsents = consentRepository.countByStatus(Consent.ConsentStatus.APPROVED);
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalPatients", totalPatients);
        stats.put("totalDoctors", totalDoctors);
        stats.put("activeUsers", activeUsers);
        stats.put("totalRecords", totalRecords);
        stats.put("activeRecords", activeRecords);
        stats.put("totalConsents", totalConsents);
        stats.put("pendingConsents", pendingConsents);
        stats.put("approvedConsents", approvedConsents);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole().name());
            userMap.put("isActive", user.getIsActive());
            userMap.put("createdAt", user.getCreatedAt());
            
            // Add specific details based on role
            if (user.getRole() == User.Role.PATIENT) {
                patientRepository.findByUserId(user.getId()).ifPresent(patient -> {
                    userMap.put("patientId", patient.getId());
                    userMap.put("firstName", patient.getFirstName());
                    userMap.put("lastName", patient.getLastName());
                    userMap.put("phone", patient.getPhone());
                    userMap.put("gender", patient.getGender());
                });
            } else if (user.getRole() == User.Role.DOCTOR) {
                doctorRepository.findByUserId(user.getId()).ifPresent(doctor -> {
                    userMap.put("doctorId", doctor.getId());
                    userMap.put("firstName", doctor.getFirstName());
                    userMap.put("lastName", doctor.getLastName());
                    userMap.put("specialization", doctor.getSpecialization());
                    userMap.put("hospitalAffiliation", doctor.getHospitalAffiliation());
                });
            }
            
            return userMap;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(userList);
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/medical-records")
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
        List<MedicalRecord> records = medicalRecordRepository.findAll();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/consents")
    public ResponseEntity<List<ConsentResponseDTO>> getAllConsents() {
        List<Consent> consents = consentRepository.findAll();
        List<ConsentResponseDTO> consentDTOs = consents.stream()
            .map(this::mapConsentToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(consentDTOs);
    }

    @GetMapping("/patient/{patientId}/records")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/doctor/{doctorId}/records")
    public ResponseEntity<List<MedicalRecord>> getDoctorRecords(@PathVariable Long doctorId) {
        List<MedicalRecord> records = medicalRecordRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/patient/{patientId}/details")
    public ResponseEntity<Map<String, Object>> getPatientDetails(@PathVariable Long patientId) {
        Patient patient = patientRepository.findById(Objects.requireNonNull(patientId))
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Map<String, Object> details = new HashMap<>();
        details.put("id", Objects.requireNonNull(patient.getId()));
        details.put("userId", patient.getUser().getId());
        details.put("email", patient.getUser().getEmail());
        details.put("firstName", patient.getFirstName());
        details.put("lastName", patient.getLastName());
        details.put("dateOfBirth", patient.getDateOfBirth());
        details.put("gender", patient.getGender().name());
        details.put("phone", patient.getPhone());
        details.put("address", patient.getAddress());
        details.put("emergencyContact", patient.getEmergencyContact());
        details.put("emergencyPhone", patient.getEmergencyPhone());
        details.put("isActive", patient.getUser().getIsActive());
        details.put("createdAt", patient.getCreatedAt());
        
        // Add medical records count
        long recordsCount = medicalRecordRepository.findByPatientId(patientId).size();
        details.put("medicalRecordsCount", recordsCount);
        
        // Add consents count
        long consentsCount = consentRepository.findByPatientId(patientId).size();
        details.put("consentsCount", consentsCount);
        
        return ResponseEntity.ok(details);
    }

    @GetMapping("/doctor/{doctorId}/details")
    public ResponseEntity<Map<String, Object>> getDoctorDetails(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(doctorId))
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Map<String, Object> details = new HashMap<>();
        details.put("id", Objects.requireNonNull(doctor.getId()));
        details.put("userId", doctor.getUser().getId());
        details.put("email", doctor.getUser().getEmail());
        details.put("firstName", doctor.getFirstName());
        details.put("lastName", doctor.getLastName());
        details.put("specialization", doctor.getSpecialization());
        details.put("licenseNumber", doctor.getLicenseNumber());
        details.put("phone", doctor.getPhone());
        details.put("hospitalAffiliation", doctor.getHospitalAffiliation());
        details.put("yearsOfExperience", doctor.getYearsOfExperience());
        details.put("isActive", doctor.getUser().getIsActive());
        details.put("createdAt", doctor.getCreatedAt());
        
        // Add medical records count
        long recordsCount = medicalRecordRepository.findByDoctorId(doctorId).size();
        details.put("medicalRecordsCount", recordsCount);
        
        // Add consents count
        long consentsCount = consentRepository.findByDoctorId(doctorId).size();
        details.put("consentsCount", consentsCount);
        
        return ResponseEntity.ok(details);
    }

    @PutMapping("/user/{userId}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleUserActive(@PathVariable Long userId) {
        User user = userRepository.findById(Objects.requireNonNull(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", Objects.requireNonNull(userId));
        response.put("isActive", user.getIsActive());
        response.put("message", "User status updated successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<Map<String, Object>>> getPendingApprovals() {
        List<User> pendingUsers = userRepository.findByIsActive(false);
        
        List<Map<String, Object>> pendingList = pendingUsers.stream()
            .filter(user -> user.getRole() != User.Role.ADMIN) // Don't include admins
            .map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("email", user.getEmail());
                userMap.put("role", user.getRole().name());
                userMap.put("createdAt", user.getCreatedAt());
                
                // Add specific details based on role
                if (user.getRole() == User.Role.PATIENT) {
                    patientRepository.findByUserId(user.getId()).ifPresent(patient -> {
                        userMap.put("patientId", patient.getId());
                        userMap.put("firstName", patient.getFirstName());
                        userMap.put("lastName", patient.getLastName());
                        userMap.put("phone", patient.getPhone());
                        userMap.put("dateOfBirth", patient.getDateOfBirth());
                        userMap.put("gender", patient.getGender());
                    });
                } else if (user.getRole() == User.Role.DOCTOR) {
                    doctorRepository.findByUserId(user.getId()).ifPresent(doctor -> {
                        userMap.put("doctorId", doctor.getId());
                        userMap.put("firstName", doctor.getFirstName());
                        userMap.put("lastName", doctor.getLastName());
                        userMap.put("specialization", doctor.getSpecialization());
                        userMap.put("licenseNumber", doctor.getLicenseNumber());
                        userMap.put("hospitalAffiliation", doctor.getHospitalAffiliation());
                    });
                }
                
                return userMap;
            }).collect(Collectors.toList());
        
        return ResponseEntity.ok(pendingList);
    }

    @PutMapping("/approve-user/{userId}")
    public ResponseEntity<Map<String, Object>> approveUser(@PathVariable Long userId) {
        User user = userRepository.findById(Objects.requireNonNull(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getIsActive()) {
            throw new RuntimeException("User is already active");
        }
        
        user.setIsActive(true);
        userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", Objects.requireNonNull(userId));
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("message", "User approved successfully");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reject-user/{userId}")
    public ResponseEntity<Map<String, Object>> rejectUser(@PathVariable Long userId) {
        User user = userRepository.findById(Objects.requireNonNull(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getIsActive()) {
            throw new RuntimeException("Cannot reject an active user");
        }
        
        // Delete associated patient or doctor record first
        if (user.getRole() == User.Role.PATIENT) {
            patientRepository.findByUserId(userId).ifPresent(patientRepository::delete);
        } else if (user.getRole() == User.Role.DOCTOR) {
            doctorRepository.findByUserId(userId).ifPresent(doctorRepository::delete);
        }
        
        // Delete user
        userRepository.delete(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", Objects.requireNonNull(userId));
        response.put("message", "User registration rejected and deleted");
        
        return ResponseEntity.ok(response);
    }

    // Admin approves consent on behalf of patient
    @PutMapping("/consent/{consentId}/approve")
    public ResponseEntity<?> adminApproveConsent(@PathVariable Long consentId) {
        Consent consent = consentRepository.findById(Objects.requireNonNull(consentId))
                .orElseThrow(() -> new RuntimeException("Consent not found"));
        
        // Check if consent is already in a non-pending state
        if (consent.getStatus() != Consent.ConsentStatus.PENDING) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Consent #" + consentId + " is already " + consent.getStatus() + ", not PENDING");
            error.put("consentId", consentId);
            error.put("currentStatus", consent.getStatus().name());
            error.put("patientName", consent.getPatient().getFirstName() + " " + consent.getPatient().getLastName());
            error.put("doctorName", "Dr. " + consent.getDoctor().getFirstName() + " " + consent.getDoctor().getLastName());
            return ResponseEntity.status(409).body(error);
        }
        
        // Approve consent using the consent service
        ConsentResponseDTO response = consentService.approveConsent(
                Objects.requireNonNull(consent.getPatient().getId()), consentId);
        
        return ResponseEntity.ok(response);
    }

    private ConsentResponseDTO mapConsentToDTO(Consent consent) {
        ConsentResponseDTO dto = new ConsentResponseDTO();
        dto.setId(consent.getId());
        dto.setPatientId(consent.getPatient().getId());
        dto.setPatientName(consent.getPatient().getFirstName() + " " + consent.getPatient().getLastName());
        dto.setDoctorId(consent.getDoctor().getId());
        dto.setDoctorName("Dr. " + consent.getDoctor().getFirstName() + " " + consent.getDoctor().getLastName());
        
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
