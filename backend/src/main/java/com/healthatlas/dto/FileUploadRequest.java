package com.healthatlas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private Long organId;
    
    @NotBlank(message = "Document name is required")
    private String documentName;
    
    private String description;
}