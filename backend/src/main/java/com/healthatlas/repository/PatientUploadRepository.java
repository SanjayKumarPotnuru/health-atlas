package com.healthatlas.repository;

import com.healthatlas.model.PatientUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientUploadRepository extends JpaRepository<PatientUpload, Long> {
    
    List<PatientUpload> findByPatientId(Long patientId);
    
    List<PatientUpload> findByPatientIdAndOrganId(Long patientId, Long organId);
}
