package com.healthatlas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientMedicalRecordRequest {

    @NotNull(message = "Organ ID is required")
    private Long organId;

    @NotBlank(message = "Diagnosis/Symptoms is required")
    private String diagnosis;

    private String notes;

    @NotBlank(message = "Treatment status is required")
    private String treatmentStatus; // NORMAL, UNDER_TREATMENT

    @NotNull(message = "Record date is required")
    private LocalDate recordDate;
}
