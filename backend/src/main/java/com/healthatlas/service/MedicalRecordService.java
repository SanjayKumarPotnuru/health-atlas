package com.healthatlas.service;

import com.healthatlas.dto.MedicalRecordRequest;
import com.healthatlas.dto.MedicalRecordResponse;
import com.healthatlas.dto.PatientMedicalRecordRequest;
import com.healthatlas.exception.ResourceNotFoundException;
import com.healthatlas.exception.UnauthorizedException;
import com.healthatlas.model.Doctor;
import com.healthatlas.model.MedicalRecord;
import com.healthatlas.model.Organ;
import com.healthatlas.model.Patient;
import com.healthatlas.repository.DoctorRepository;
import com.healthatlas.repository.MedicalRecordRepository;
import com.healthatlas.repository.OrganRepository;
import com.healthatlas.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final OrganRepository organRepository;
    private final ConsentService consentService;

    @Transactional
    public MedicalRecordResponse addMedicalRecord(Long doctorId, MedicalRecordRequest request) {
        // Get doctor
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Get patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Get organ
        Organ organ = organRepository.findById(request.getOrganId())
                .orElseThrow(() -> new ResourceNotFoundException("Organ not found"));

        // Check if doctor has active consent
        if (!consentService.hasActiveConsent(patient.getId(), doctor.getId())) {
            throw new UnauthorizedException("No active consent from patient. Please request consent first.");
        }

        // Create medical record (immutable)
        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setOrgan(organ);
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescriptions(request.getPrescriptions());
        record.setClinicalNotes(request.getClinicalNotes());
        record.setTreatmentStatus(MedicalRecord.TreatmentStatus.valueOf(request.getTreatmentStatus()));
        record.setRecordDate(request.getRecordDate());

        record = medicalRecordRepository.save(record);

        return mapToDTO(record);
    }

    @Transactional
    public MedicalRecordResponse addPatientSelfRecord(Long patientId, PatientMedicalRecordRequest request) {
        // Get patient
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Get organ
        Organ organ = organRepository.findById(request.getOrganId())
                .orElseThrow(() -> new ResourceNotFoundException("Organ not found"));

        // Create self-reported medical record (no doctor required)
        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(null); // Self-reported, no doctor
        record.setOrgan(organ);
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescriptions(null); // Patients can't prescribe
        record.setClinicalNotes(request.getNotes());
        record.setTreatmentStatus(MedicalRecord.TreatmentStatus.valueOf(request.getTreatmentStatus()));
        record.setRecordDate(request.getRecordDate());

        record = medicalRecordRepository.save(record);

        return mapToDTO(record);
    }

    public List<MedicalRecordResponse> getPatientRecordsByOrgan(Long patientId, Long organId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdAndOrganId(patientId, organId);
        return records.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicalRecordResponse> getAllPatientRecords(Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);
        return records.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicalRecordResponse> getDoctorAccessibleRecords(Long doctorId, Long patientId, Long organId) {
        // Check if doctor has active consent
        if (!consentService.hasActiveConsent(patientId, doctorId)) {
            throw new UnauthorizedException("No active consent from patient. Cannot access records.");
        }

        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdAndOrganId(patientId, organId);
        return records.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private MedicalRecordResponse mapToDTO(MedicalRecord record) {
        MedicalRecordResponse dto = new MedicalRecordResponse();
        dto.setId(record.getId());
        dto.setPatientId(record.getPatient().getId());
        dto.setPatientName(record.getPatient().getFirstName() + " " + record.getPatient().getLastName());
        
        // Handle self-reported records (no doctor)
        if (record.getDoctor() != null) {
            dto.setDoctorId(record.getDoctor().getId());
            dto.setDoctorName("Dr. " + record.getDoctor().getFirstName() + " " + record.getDoctor().getLastName());
        } else {
            dto.setDoctorId(null);
            dto.setDoctorName("Self-Reported");
        }
        
        dto.setOrganId(record.getOrgan().getId());
        dto.setOrganName(record.getOrgan().getDisplayName());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setPrescriptions(record.getPrescriptions());
        dto.setClinicalNotes(record.getClinicalNotes());
        dto.setTreatmentStatus(record.getTreatmentStatus().name());
        dto.setRecordDate(record.getRecordDate());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}
