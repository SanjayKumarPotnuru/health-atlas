package com.healthatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long organId;
    private String organName;
    private String diagnosis;
    private String prescriptions;
    private String clinicalNotes;
    private String treatmentStatus;
    private LocalDate recordDate;
    private LocalDateTime createdAt;
}
