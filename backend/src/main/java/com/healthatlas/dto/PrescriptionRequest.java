package com.healthatlas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long medicalRecordId;

    private String visitType;

    @NotBlank(message = "Chief complaint is required")
    private String chiefComplaint;

    @NotBlank(message = "Final diagnosis is required")
    private String finalDiagnosis;

    private String vitalsBp;
    private String vitalsBmi;
    private String vitalsTemperature;
    private String vitalsPulse;

    private String clinicalNotes;

    private LocalDate followUpDate;
    private String followUpNotes;

    @NotNull(message = "Prescription date is required")
    private LocalDate prescriptionDate;

    @Valid
    @NotNull(message = "At least one medicine is required")
    private List<MedicineItem> medicines;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicineItem {
        @NotBlank(message = "Medicine name is required")
        private String medicineName;

        private String genericName;
        private String dosage;

        @NotBlank(message = "Frequency is required")
        private String frequency;

        private String route;
        private String timing;

        @NotBlank(message = "Duration is required")
        private String duration;

        private String instructions;
    }
}
