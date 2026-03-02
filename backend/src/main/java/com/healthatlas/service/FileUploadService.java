package com.healthatlas.service;

import com.healthatlas.dto.FileUploadResponse;
import com.healthatlas.exception.ResourceNotFoundException;
import com.healthatlas.model.Organ;
import com.healthatlas.model.Patient;
import com.healthatlas.model.PatientUpload;
import com.healthatlas.repository.OrganRepository;
import com.healthatlas.repository.PatientRepository;
import com.healthatlas.repository.PatientUploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final PatientUploadRepository patientUploadRepository;
    private final PatientRepository patientRepository;
    private final OrganRepository organRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Upload a PDF file for a patient's medical record
     */
    public FileUploadResponse uploadFile(
            Long patientId,
            Long organId,
            String documentName,
            String description,
            MultipartFile file) throws IOException {

        // Validate patient exists
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + patientId));

        // Validate organ if provided
        Organ organ = null;
        if (organId != null) {
            organ = organRepository.findById(organId)
                    .orElseThrow(() -> new ResourceNotFoundException("Organ not found with ID: " + organId));
        }

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type (PDF only)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        // Validate file size (max 10MB)
        long maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file to disk
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create PatientUpload record
        PatientUpload upload = new PatientUpload();
        upload.setPatient(patient);
        upload.setOrgan(organ);
        upload.setDocumentName(documentName);
        upload.setFilePath(uniqueFilename);
        upload.setFileType(contentType);
        upload.setFileSize(file.getSize());
        upload.setDescription(description);
        upload.setIsVerified(false);

        PatientUpload savedUpload = patientUploadRepository.save(upload);

        log.info("File uploaded successfully: {} for patient ID: {}", uniqueFilename, patientId);

        return mapToResponse(savedUpload);
    }

    /**
     * Get all uploads for a patient
     */
    public List<FileUploadResponse> getPatientUploads(Long patientId) {
        List<PatientUpload> uploads = patientUploadRepository.findByPatientId(patientId);
        return uploads.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get uploads for a patient by organ
     */
    public List<FileUploadResponse> getPatientUploadsByOrgan(Long patientId, Long organId) {
        List<PatientUpload> uploads = patientUploadRepository.findByPatientIdAndOrganId(patientId, organId);
        return uploads.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Download a file
     */
    public Resource downloadFile(Long uploadId) throws IOException {
        PatientUpload upload = patientUploadRepository.findById(uploadId)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with ID: " + uploadId));

        Path filePath = Paths.get(uploadDir).resolve(upload.getFilePath()).normalize();
        
        // If file doesn't exist, create a placeholder for sample data
        if (!Files.exists(filePath)) {
            createPlaceholderFile(filePath, upload);
        }
        
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new ResourceNotFoundException("File not found: " + upload.getFilePath());
        }
    }
    
    /**
     * Create a placeholder PDF file for sample/demo data
     */
    private void createPlaceholderFile(Path filePath, PatientUpload upload) throws IOException {
        // Ensure parent directory exists
        Files.createDirectories(filePath.getParent());
        
        // Clean text for PDF (escape special characters)
        String docName = cleanPdfText(upload.getDocumentName());
        String description = upload.getDescription() != null ? cleanPdfText(upload.getDescription()) : "No description provided";
        String organName = upload.getOrgan() != null ? cleanPdfText(upload.getOrgan().getDisplayName()) : "General Health";
        String patientName = cleanPdfText(upload.getPatient().getFirstName() + " " + upload.getPatient().getLastName());
        String uploadDate = upload.getUploadedAt().toString().substring(0, 10);
        String verifiedStatus = upload.getIsVerified() ? "VERIFIED" : "PENDING VERIFICATION";
        
        // Create a detailed PDF with comprehensive medical document information
        StringBuilder contentBuilder = new StringBuilder();
        contentBuilder.append("%PDF-1.4\n");
        contentBuilder.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
        contentBuilder.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
        contentBuilder.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n");
        contentBuilder.append("4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> ");
        contentBuilder.append("/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n");
        
        // Build the content stream
        StringBuilder streamContent = new StringBuilder();
        streamContent.append("BT\n");
        
        // Header
        streamContent.append("/F1 18 Tf\n");
        streamContent.append("50 750 Td\n");
        streamContent.append("(HEALTH ATLAS - MEDICAL DOCUMENT) Tj\n");
        
        // Horizontal line (simulated with underscores)
        streamContent.append("0 -5 Td\n");
        streamContent.append("/F2 10 Tf\n");
        streamContent.append("(___________________________________________________________) Tj\n");
        
        // Document Title
        streamContent.append("0 -40 Td\n");
        streamContent.append("/F1 14 Tf\n");
        streamContent.append("(DOCUMENT: ").append(docName).append(") Tj\n");
        
        // Patient Information Section
        streamContent.append("0 -35 Td\n");
        streamContent.append("/F1 12 Tf\n");
        streamContent.append("(PATIENT INFORMATION) Tj\n");
        streamContent.append("0 -20 Td\n");
        streamContent.append("/F2 11 Tf\n");
        streamContent.append("(Patient Name: ").append(patientName).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(Patient ID: P-").append(String.format("%06d", upload.getPatient().getId())).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(Date of Birth: ").append(upload.getPatient().getDateOfBirth().toString()).append(") Tj\n");
        
        // Document Details Section
        streamContent.append("0 -30 Td\n");
        streamContent.append("/F1 12 Tf\n");
        streamContent.append("(DOCUMENT DETAILS) Tj\n");
        streamContent.append("0 -20 Td\n");
        streamContent.append("/F2 11 Tf\n");
        streamContent.append("(Related Body Part/Organ: ").append(organName).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(Upload Date: ").append(uploadDate).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(Document Status: ").append(verifiedStatus).append(") Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("(File Size: ").append(formatFileSize(upload.getFileSize())).append(") Tj\n");
        
        // Description Section
        streamContent.append("0 -30 Td\n");
        streamContent.append("/F1 12 Tf\n");
        streamContent.append("(DESCRIPTION) Tj\n");
        streamContent.append("0 -20 Td\n");
        streamContent.append("/F2 10 Tf\n");
        
        // Split description into multiple lines (max ~70 chars per line)
        String[] descLines = wrapText(description, 70);
        for (String line : descLines) {
            streamContent.append("(").append(line).append(") Tj\n");
            streamContent.append("0 -15 Td\n");
        }
        
        // Important Notice
        streamContent.append("0 -20 Td\n");
        streamContent.append("/F1 11 Tf\n");
        streamContent.append("(IMPORTANT NOTICE) Tj\n");
        streamContent.append("0 -18 Td\n");
        streamContent.append("/F2 10 Tf\n");
        streamContent.append("(This is a sample/demonstration document generated by the) Tj\n");
        streamContent.append("0 -15 Td\n");
        streamContent.append("(Health Atlas system for testing and preview purposes.) Tj\n");
        streamContent.append("0 -25 Td\n");
        streamContent.append("(To replace this with actual medical documentation:) Tj\n");
        streamContent.append("0 -15 Td\n");
        streamContent.append("(1. Delete this sample document from your dashboard) Tj\n");
        streamContent.append("0 -15 Td\n");
        streamContent.append("(2. Upload the real medical report or scan as a PDF file) Tj\n");
        streamContent.append("0 -15 Td\n");
        streamContent.append("(3. Add proper description and organ association) Tj\n");
        
        // Footer
        streamContent.append("0 -40 Td\n");
        streamContent.append("/F2 9 Tf\n");
        streamContent.append("(Generated by Health Atlas Medical History System) Tj\n");
        streamContent.append("0 -12 Td\n");
        streamContent.append("(Document ID: DOC-").append(String.format("%06d", upload.getId())).append(") Tj\n");
        
        streamContent.append("ET\n");
        
        String stream = streamContent.toString();
        int streamLength = stream.length();
        
        contentBuilder.append("5 0 obj\n<< /Length ").append(streamLength).append(" >>\n");
        contentBuilder.append("stream\n");
        contentBuilder.append(stream);
        contentBuilder.append("endstream\nendobj\n");
        
        // Add xref table
        contentBuilder.append("xref\n0 6\n");
        contentBuilder.append("0000000000 65535 f\n");
        contentBuilder.append("0000000009 00000 n\n");
        contentBuilder.append("0000000058 00000 n\n");
        contentBuilder.append("0000000115 00000 n\n");
        contentBuilder.append("0000000214 00000 n\n");
        contentBuilder.append("0000000347 00000 n\n");
        
        contentBuilder.append("trailer\n<< /Size 6 /Root 1 0 R >>\n");
        contentBuilder.append("startxref\n");
        contentBuilder.append(contentBuilder.length() + 20);
        contentBuilder.append("\n%%EOF");
        
        Files.write(filePath, contentBuilder.toString().getBytes());
        log.info("Created detailed placeholder PDF file: {}", filePath);
    }
    
    /**
     * Clean text for PDF output - escape special characters
     */
    private String cleanPdfText(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("(", "\\(")
                   .replace(")", "\\)")
                   .replace("\n", " ")
                   .replace("\r", " ");
    }
    
    /**
     * Wrap text into lines of specified maximum length
     */
    private String[] wrapText(String text, int maxLength) {
        if (text == null || text.isEmpty()) {
            return new String[]{"N/A"};
        }
        
        java.util.List<String> lines = new java.util.ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();
        
        for (String word : words) {
            if (currentLine.length() + word.length() + 1 > maxLength) {
                if (currentLine.length() > 0) {
                    lines.add(currentLine.toString());
                    currentLine = new StringBuilder();
                }
            }
            if (currentLine.length() > 0) {
                currentLine.append(" ");
            }
            currentLine.append(word);
        }
        
        if (currentLine.length() > 0) {
            lines.add(currentLine.toString());
        }
        
        return lines.toArray(new String[0]);
    }
    
    /**
     * Format file size to human-readable format
     */
    private String formatFileSize(Long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.2f KB", bytes / 1024.0);
        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
    }

    /**
     * Delete an upload
     */
    public void deleteUpload(Long uploadId) throws IOException {
        PatientUpload upload = patientUploadRepository.findById(uploadId)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with ID: " + uploadId));

        // Delete file from disk
        Path filePath = Paths.get(uploadDir).resolve(upload.getFilePath()).normalize();
        Files.deleteIfExists(filePath);

        // Delete record from database
        patientUploadRepository.delete(upload);

        log.info("File deleted successfully: {} for upload ID: {}", upload.getFilePath(), uploadId);
    }

    /**
     * Verify an upload (admin/doctor functionality)
     */
    public FileUploadResponse verifyUpload(Long uploadId) {
        PatientUpload upload = patientUploadRepository.findById(uploadId)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found with ID: " + uploadId));

        upload.setIsVerified(true);
        PatientUpload verifiedUpload = patientUploadRepository.save(upload);

        log.info("Upload verified: {} for upload ID: {}", upload.getFilePath(), uploadId);

        return mapToResponse(verifiedUpload);
    }
    
    /**
     * Admin: Get all uploads across all patients
     */
    public List<FileUploadResponse> getAllUploads() {
        List<PatientUpload> uploads = patientUploadRepository.findAll();
        return uploads.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Doctor: Get patient uploads (with consent check)
     */
    public List<FileUploadResponse> getDoctorAccessibleUploads(Long doctorId, Long patientId) {
        // TODO: Add consent verification logic here
        // For now, returning all patient uploads if doctor has access
        List<PatientUpload> uploads = patientUploadRepository.findByPatientId(patientId);
        return uploads.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map PatientUpload entity to FileUploadResponse DTO
     */
    private FileUploadResponse mapToResponse(PatientUpload upload) {
        return FileUploadResponse.builder()
                .id(upload.getId())
                .patientId(upload.getPatient().getId())
                .organId(upload.getOrgan() != null ? upload.getOrgan().getId() : null)
                .organName(upload.getOrgan() != null ? upload.getOrgan().getName() : null)
                .documentName(upload.getDocumentName())
                .filePath(upload.getFilePath())
                .fileType(upload.getFileType())
                .fileSize(upload.getFileSize())
                .description(upload.getDescription())
                .isVerified(upload.getIsVerified())
                .uploadedAt(upload.getUploadedAt())
                .build();
    }
}
