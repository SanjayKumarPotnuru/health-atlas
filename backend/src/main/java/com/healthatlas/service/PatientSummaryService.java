package com.healthatlas.service;

import com.healthatlas.dto.PatientSummaryResponse;
import com.healthatlas.dto.PatientSummaryResponse.*;
import com.healthatlas.exception.ResourceNotFoundException;
import com.healthatlas.model.*;
import com.healthatlas.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service that aggregates all patient data into a comprehensive medical summary.
 * Used by AI chatbot and MCP server to provide doctors with a complete patient overview.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PatientSummaryService {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientUploadRepository patientUploadRepository;
    private final PatientNoteRepository patientNoteRepository;

    @Transactional(readOnly = true)
    public PatientSummaryResponse getPatientSummary(Long patientId) {
        // 1. Get patient
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + patientId));

        // 2. Get all medical records
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);

        // 3. Get all prescriptions
        List<Prescription> prescriptions = prescriptionRepository
                .findByPatientIdOrderByPrescriptionDateDesc(patientId);

        // 4. Get uploaded documents
        List<PatientUpload> uploads = patientUploadRepository.findByPatientId(patientId);

        // 5. Get patient notes
        List<PatientNote> notes = patientNoteRepository.findByPatientId(patientId);

        // Calculate age
        String age = "Unknown";
        if (patient.getDateOfBirth() != null) {
            int years = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
            age = years + " years";
        }

        // Count conditions by status
        long activeCount = records.stream()
                .filter(r -> r.getTreatmentStatus() == MedicalRecord.TreatmentStatus.UNDER_TREATMENT)
                .count();
        long resolvedCount = records.stream()
                .filter(r -> r.getTreatmentStatus() == MedicalRecord.TreatmentStatus.NORMAL)
                .count();

        // Get unique organs affected
        List<String> organsAffected = records.stream()
                .filter(r -> r.getOrgan() != null)
                .map(r -> r.getOrgan().getName())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        // Build summary
        return PatientSummaryResponse.builder()
                .patientId(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .fullName(patient.getFirstName() + " " + patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .age(age)
                .gender(patient.getGender() != null ? patient.getGender().name() : null)
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .emergencyPhone(patient.getEmergencyPhone())
                .email(patient.getUser() != null ? patient.getUser().getEmail() : null)
                // Statistics
                .totalMedicalRecords(records.size())
                .totalPrescriptions(prescriptions.size())
                .totalDocumentsUploaded(uploads.size())
                .totalNotes(notes.size())
                .activeConditions((int) activeCount)
                .resolvedConditions((int) resolvedCount)
                .organsAffected(organsAffected)
                // Detailed data
                .medicalRecords(mapMedicalRecords(records))
                .prescriptions(mapPrescriptions(prescriptions))
                .documents(mapDocuments(uploads))
                .notes(mapNotes(notes))
                .build();
    }

    private List<MedicalRecordSummary> mapMedicalRecords(List<MedicalRecord> records) {
        return records.stream().map(r -> MedicalRecordSummary.builder()
                .id(r.getId())
                .organName(r.getOrgan() != null ? r.getOrgan().getName() : "Unknown")
                .diagnosis(r.getDiagnosis())
                .clinicalNotes(r.getClinicalNotes())
                .treatmentStatus(r.getTreatmentStatus() != null ? r.getTreatmentStatus().name() : null)
                .doctorName(r.getDoctor() != null ?
                        "Dr. " + r.getDoctor().getFirstName() + " " + r.getDoctor().getLastName() : "Self-reported")
                .doctorSpecialization(r.getDoctor() != null ? r.getDoctor().getSpecialization() : null)
                .recordDate(r.getRecordDate())
                .build()
        ).collect(Collectors.toList());
    }

    private List<PrescriptionSummary> mapPrescriptions(List<Prescription> prescriptions) {
        return prescriptions.stream().map(p -> PrescriptionSummary.builder()
                .id(p.getId())
                .visitType(p.getVisitType())
                .chiefComplaint(p.getChiefComplaint())
                .finalDiagnosis(p.getFinalDiagnosis())
                .vitalsBp(p.getVitalsBp())
                .vitalsBmi(p.getVitalsBmi())
                .vitalsTemperature(p.getVitalsTemperature())
                .vitalsPulse(p.getVitalsPulse())
                .clinicalNotes(p.getClinicalNotes())
                .prescriptionDate(p.getPrescriptionDate())
                .followUpDate(p.getFollowUpDate())
                .followUpNotes(p.getFollowUpNotes())
                .doctorName(p.getDoctor() != null ?
                        "Dr. " + p.getDoctor().getFirstName() + " " + p.getDoctor().getLastName() : null)
                .doctorSpecialization(p.getDoctor() != null ? p.getDoctor().getSpecialization() : null)
                .medicines(p.getMedicines() != null ? p.getMedicines().stream().map(m ->
                        MedicineSummary.builder()
                                .medicineName(m.getMedicineName())
                                .genericName(m.getGenericName())
                                .dosage(m.getDosage())
                                .frequency(m.getFrequency())
                                .route(m.getRoute())
                                .timing(m.getTiming())
                                .duration(m.getDuration())
                                .instructions(m.getInstructions())
                                .build()
                ).collect(Collectors.toList()) : List.of())
                .build()
        ).collect(Collectors.toList());
    }

    private List<DocumentSummary> mapDocuments(List<PatientUpload> uploads) {
        return uploads.stream().map(u -> DocumentSummary.builder()
                .documentName(u.getDocumentName())
                .organName(u.getOrgan() != null ? u.getOrgan().getName() : "General")
                .fileType(u.getFileType())
                .description(u.getDescription())
                .verified(u.getIsVerified() != null && u.getIsVerified())
                .build()
        ).collect(Collectors.toList());
    }

    private List<NoteSummary> mapNotes(List<PatientNote> notes) {
        return notes.stream().map(n -> NoteSummary.builder()
                .organName(n.getOrgan() != null ? n.getOrgan().getName() : "General")
                .noteText(n.getNoteText())
                .noteDate(n.getNoteDate())
                .build()
        ).collect(Collectors.toList());
    }
}
