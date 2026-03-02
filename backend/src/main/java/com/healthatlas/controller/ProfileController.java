package com.healthatlas.controller;

import com.healthatlas.dto.AdminProfileDTO;
import com.healthatlas.dto.DoctorProfileDTO;
import com.healthatlas.dto.PatientProfileDTO;
import com.healthatlas.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    // Patient Profile Endpoints
    @GetMapping("/patient/{userId}/profile")
    public ResponseEntity<PatientProfileDTO> getPatientProfile(@PathVariable Long userId) {
        PatientProfileDTO profile = profileService.getPatientProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/patient/{userId}/profile")
    public ResponseEntity<PatientProfileDTO> updatePatientProfile(
            @PathVariable Long userId,
            @Valid @RequestBody PatientProfileDTO profileDTO) {
        PatientProfileDTO updated = profileService.updatePatientProfile(userId, profileDTO);
        return ResponseEntity.ok(updated);
    }

    // Doctor Profile Endpoints
    @GetMapping("/doctor/{userId}/profile")
    public ResponseEntity<DoctorProfileDTO> getDoctorProfile(@PathVariable Long userId) {
        DoctorProfileDTO profile = profileService.getDoctorProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/doctor/{userId}/profile")
    public ResponseEntity<DoctorProfileDTO> updateDoctorProfile(
            @PathVariable Long userId,
            @Valid @RequestBody DoctorProfileDTO profileDTO) {
        DoctorProfileDTO updated = profileService.updateDoctorProfile(userId, profileDTO);
        return ResponseEntity.ok(updated);
    }

    // Admin Profile Endpoints
    @GetMapping("/admin/{userId}/profile")
    public ResponseEntity<AdminProfileDTO> getAdminProfile(@PathVariable Long userId) {
        AdminProfileDTO profile = profileService.getAdminProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
