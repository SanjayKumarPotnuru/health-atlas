package com.healthatlas.repository;

import com.healthatlas.model.Consent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentRepository extends JpaRepository<Consent, Long> {
    
    List<Consent> findByPatientId(Long patientId);
    
    List<Consent> findByDoctorId(Long doctorId);
    
    @Query("SELECT c FROM Consent c WHERE c.patient.id = :patientId AND c.doctor.id = :doctorId AND c.status = 'APPROVED'")
    Optional<Consent> findActiveConsentByPatientAndDoctor(Long patientId, Long doctorId);
    
    List<Consent> findByPatientIdAndStatus(Long patientId, Consent.ConsentStatus status);
    
    List<Consent> findByDoctorIdAndStatus(Long doctorId, Consent.ConsentStatus status);
    
    long countByStatus(Consent.ConsentStatus status);
}
