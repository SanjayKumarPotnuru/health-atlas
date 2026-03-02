package com.healthatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfileDTO {
    private Long userId;
    private Long doctorId;
    private String email;
    private String firstName;
    private String lastName;
    private String specialization;
    private String licenseNumber;
    private String phone;
    private String hospitalAffiliation;
    private Integer yearsOfExperience;
}
