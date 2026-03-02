package com.healthatlas.controller;

import com.healthatlas.dto.FileUploadResponse;
import com.healthatlas.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * Upload a PDF file for a patient's medical record
     * 
     * @param patientId Patient ID
     * @param organId Organ ID (optional)
     * @param documentName Name/title of the document
     * @param description Description of the document (optional)
     * @param file PDF file to upload
     */
    @PostMapping(value = "/patient/{patientId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponse> uploadFile(
            @PathVariable Long patientId,
            @RequestParam(required = false) Long organId,
            @RequestParam String documentName,
            @RequestParam(required = false) String description,
            @RequestParam("file") MultipartFile file) {
        try {
            FileUploadResponse response = fileUploadService.uploadFile(
                    patientId, organId, documentName, description, file);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all uploads for a patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<FileUploadResponse>> getPatientUploads(
            @PathVariable Long patientId) {
        List<FileUploadResponse> uploads = fileUploadService.getPatientUploads(patientId);
        return ResponseEntity.ok(uploads);
    }

    /**
     * Get uploads for a patient by organ
     */
    @GetMapping("/patient/{patientId}/organ/{organId}")
    public ResponseEntity<List<FileUploadResponse>> getPatientUploadsByOrgan(
            @PathVariable Long patientId,
            @PathVariable Long organId) {
        List<FileUploadResponse> uploads = fileUploadService.getPatientUploadsByOrgan(patientId, organId);
        return ResponseEntity.ok(uploads);
    }

    /**
     * Download a file
     */
    @GetMapping("/download/{uploadId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long uploadId) {
        try {
            Resource resource = fileUploadService.downloadFile(uploadId);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete an upload
     */
    @DeleteMapping("/{uploadId}")
    public ResponseEntity<Void> deleteUpload(@PathVariable Long uploadId) {
        try {
            fileUploadService.deleteUpload(uploadId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Verify an upload (admin/doctor functionality)
     */
    @PutMapping("/{uploadId}/verify")
    public ResponseEntity<FileUploadResponse> verifyUpload(@PathVariable Long uploadId) {
        FileUploadResponse response = fileUploadService.verifyUpload(uploadId);
        return ResponseEntity.ok(response);
    }
}
