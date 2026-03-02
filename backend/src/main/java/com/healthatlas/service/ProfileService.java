package com.healthatlas.service;

import com.healthatlas.dto.AdminProfileDTO;
import com.healthatlas.dto.DoctorProfileDTO;
import com.healthatlas.dto.PatientProfileDTO;
import com.healthatlas.model.Doctor;
import com.healthatlas.model.Patient;
import com.healthatlas.model.User;
import com.healthatlas.repository.DoctorRepository;
import com.healthatlas.repository.PatientRepository;
import com.healthatlas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Transactional(readOnly = true)
    public PatientProfileDTO getPatientProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return mapToPatientProfileDTO(user, patient);
    }

    @Transactional
    public PatientProfileDTO updatePatientProfile(Long userId, PatientProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Update patient fields
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(Patient.Gender.valueOf(dto.getGender()));
        patient.setPhone(dto.getPhone());
        patient.setAddress(dto.getAddress());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setEmergencyPhone(dto.getEmergencyPhone());

        Patient updated = patientRepository.save(patient);
        return mapToPatientProfileDTO(user, updated);
    }

    @Transactional(readOnly = true)
    public DoctorProfileDTO getDoctorProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return mapToDoctorProfileDTO(user, doctor);
    }

    @Transactional
    public DoctorProfileDTO updateDoctorProfile(Long userId, DoctorProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Update doctor fields
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setPhone(dto.getPhone());
        doctor.setHospitalAffiliation(dto.getHospitalAffiliation());
        doctor.setYearsOfExperience(dto.getYearsOfExperience());
        // Note: licenseNumber is typically not editable

        Doctor updated = doctorRepository.save(doctor);
        return mapToDoctorProfileDTO(user, updated);
    }

    @Transactional(readOnly = true)
    public AdminProfileDTO getAdminProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminProfileDTO dto = new AdminProfileDTO();
        dto.setUserId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }

    // Helper mapping methods
    private PatientProfileDTO mapToPatientProfileDTO(User user, Patient patient) {
        PatientProfileDTO dto = new PatientProfileDTO();
        dto.setUserId(user.getId());
        dto.setPatientId(patient.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender().name());
        dto.setPhone(patient.getPhone());
        dto.setAddress(patient.getAddress());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setEmergencyPhone(patient.getEmergencyPhone());
        return dto;
    }

    private DoctorProfileDTO mapToDoctorProfileDTO(User user, Doctor doctor) {
        DoctorProfileDTO dto = new DoctorProfileDTO();
        dto.setUserId(user.getId());
        dto.setDoctorId(doctor.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setPhone(doctor.getPhone());
        dto.setHospitalAffiliation(doctor.getHospitalAffiliation());
        dto.setYearsOfExperience(doctor.getYearsOfExperience());
        return dto;
    }
}
