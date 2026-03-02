package com.healthatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {

    private Long id;
    private Long patientId;
    private String patientName;
    private String patientAge;
    private String patientGender;
    private String patientPhone;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorLicenseNumber;
    private String hospitalAffiliation;

    private Long medicalRecordId;
    private String visitType;
    private String chiefComplaint;
    private String finalDiagnosis;

    private String vitalsBp;
    private String vitalsBmi;
    private String vitalsTemperature;
    private String vitalsPulse;

    private String clinicalNotes;
    private LocalDate followUpDate;
    private String followUpNotes;

    private LocalDate prescriptionDate;
    private String pdfPath;
    private LocalDateTime createdAt;

    private List<MedicineDetail> medicines;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicineDetail {
        private Long id;
        private Integer serialNumber;
        private String medicineName;
        private String genericName;
        private String dosage;
        private String frequency;
        private String route;
        private String timing;
        private String duration;
        private String instructions;
    }
}
