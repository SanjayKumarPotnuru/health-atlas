package com.healthatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {
    
    private Long id;
    private Long patientId;
    private String patientName;
    private Long organId;
    private String organName;
    private String documentName;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private String description;
    private Boolean isVerified;
    private LocalDateTime uploadedAt;
}
