package com.healthatlas.repository;

import com.healthatlas.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByPatientIdAndOrganId(Long patientId, Long organId);
    
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    long countByTreatmentStatus(MedicalRecord.TreatmentStatus status);
}
