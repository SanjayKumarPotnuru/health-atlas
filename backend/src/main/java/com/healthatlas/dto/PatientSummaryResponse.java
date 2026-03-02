package com.healthatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Comprehensive patient medical summary DTO.
 * Aggregates all patient data into one response for AI-powered summary generation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientSummaryResponse {

    // --- Patient Demographics ---
    private Long patientId;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private String age;
    private String gender;
    private String phone;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    private String email;

    // --- Summary Statistics ---
    private int totalMedicalRecords;
    private int totalPrescriptions;
    private int totalDocumentsUploaded;
    private int totalNotes;
    private int activeConditions;      // UNDER_TREATMENT count
    private int resolvedConditions;    // NORMAL count
    private List<String> organsAffected;

    // --- Medical Records ---
    private List<MedicalRecordSummary> medicalRecords;

    // --- Prescriptions ---
    private List<PrescriptionSummary> prescriptions;

    // --- Uploaded Documents ---
    private List<DocumentSummary> documents;

    // --- Patient Notes ---
    private List<NoteSummary> notes;

    // --- Inner DTOs ---

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MedicalRecordSummary {
        private Long id;
        private String organName;
        private String diagnosis;
        private String clinicalNotes;
        private String treatmentStatus;
        private String doctorName;
        private String doctorSpecialization;
        private LocalDate recordDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PrescriptionSummary {
        private Long id;
        private String visitType;
        private String chiefComplaint;
        private String finalDiagnosis;
        private String vitalsBp;
        private String vitalsBmi;
        private String vitalsTemperature;
        private String vitalsPulse;
        private String clinicalNotes;
        private LocalDate prescriptionDate;
        private LocalDate followUpDate;
        private String followUpNotes;
        private String doctorName;
        private String doctorSpecialization;
        private List<MedicineSummary> medicines;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MedicineSummary {
        private String medicineName;
        private String genericName;
        private String dosage;
        private String frequency;
        private String route;
        private String timing;
        private String duration;
        private String instructions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DocumentSummary {
        private String documentName;
        private String organName;
        private String fileType;
        private String description;
        private boolean verified;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NoteSummary {
        private String organName;
        private String noteText;
        private LocalDate noteDate;
    }
}
