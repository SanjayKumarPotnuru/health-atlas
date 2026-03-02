package com.healthatlas.service;

import com.healthatlas.dto.PrescriptionRequest;
import com.healthatlas.dto.PrescriptionResponse;
import com.healthatlas.exception.ResourceNotFoundException;
import com.healthatlas.exception.UnauthorizedException;
import com.healthatlas.model.*;
import com.healthatlas.repository.DoctorRepository;
import com.healthatlas.repository.MedicalRecordRepository;
import com.healthatlas.repository.PatientRepository;
import com.healthatlas.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final ConsentService consentService;
    private final PrescriptionPdfService pdfService;

    @Transactional
    public PrescriptionResponse createPrescription(Long doctorId, PrescriptionRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Check consent
        if (!consentService.hasActiveConsent(patient.getId(), doctor.getId())) {
            throw new UnauthorizedException("No active consent from patient. Please request consent first.");
        }

        // Build prescription
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setVisitType(request.getVisitType() != null ? request.getVisitType() : "NORMAL");
        prescription.setChiefComplaint(request.getChiefComplaint());
        prescription.setFinalDiagnosis(request.getFinalDiagnosis());
        prescription.setVitalsBp(request.getVitalsBp());
        prescription.setVitalsBmi(request.getVitalsBmi());
        prescription.setVitalsTemperature(request.getVitalsTemperature());
        prescription.setVitalsPulse(request.getVitalsPulse());
        prescription.setClinicalNotes(request.getClinicalNotes());
        prescription.setFollowUpDate(request.getFollowUpDate());
        prescription.setFollowUpNotes(request.getFollowUpNotes());
        prescription.setPrescriptionDate(request.getPrescriptionDate());

        // Link to medical record if provided
        if (request.getMedicalRecordId() != null) {
            MedicalRecord record = medicalRecordRepository.findById(request.getMedicalRecordId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medical record not found"));
            prescription.setMedicalRecord(record);
        }

        // Add medicines
        if (request.getMedicines() != null) {
            for (int i = 0; i < request.getMedicines().size(); i++) {
                PrescriptionRequest.MedicineItem item = request.getMedicines().get(i);
                PrescriptionMedicine medicine = new PrescriptionMedicine();
                medicine.setSerialNumber(i + 1);
                medicine.setMedicineName(item.getMedicineName());
                medicine.setGenericName(item.getGenericName());
                medicine.setDosage(item.getDosage());
                medicine.setFrequency(item.getFrequency());
                medicine.setRoute(item.getRoute() != null ? item.getRoute() : "ORAL");
                medicine.setTiming(item.getTiming());
                medicine.setDuration(item.getDuration());
                medicine.setInstructions(item.getInstructions());
                prescription.addMedicine(medicine);
            }
        }

        prescription = prescriptionRepository.save(prescription);

        // Generate PDF
        try {
            String pdfPath = pdfService.generatePrescriptionPdf(prescription);
            prescription.setPdfPath(pdfPath);
            prescription = prescriptionRepository.save(prescription);
            log.info("Prescription PDF generated: {}", pdfPath);
        } catch (Exception e) {
            log.error("Failed to generate PDF for prescription {}: {}", prescription.getId(), e.getMessage());
        }

        return mapToResponse(prescription);
    }

    public PrescriptionResponse getPrescription(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        return mapToResponse(prescription);
    }

    public List<PrescriptionResponse> getPatientPrescriptions(Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId);
        return prescriptions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PrescriptionResponse> getDoctorPrescriptions(Long doctorId) {
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdOrderByPrescriptionDateDesc(doctorId);
        return prescriptions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PrescriptionResponse> getDoctorPatientPrescriptions(Long doctorId, Long patientId) {
        // Verify consent
        if (!consentService.hasActiveConsent(patientId, doctorId)) {
            throw new UnauthorizedException("No active consent from patient.");
        }
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdAndDoctorIdOrderByPrescriptionDateDesc(patientId, doctorId);
        return prescriptions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PrescriptionResponse> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        return prescriptions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public byte[] getPrescriptionPdf(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        try {
            return pdfService.generatePrescriptionPdfBytes(prescription);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate prescription PDF: " + e.getMessage());
        }
    }

    private String calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) return "N/A";
        Period period = Period.between(dateOfBirth, LocalDate.now());
        if (period.getMonths() > 0) {
            return period.getYears() + " Years, " + period.getMonths() + " Months";
        }
        return period.getYears() + " Years";
    }

    private PrescriptionResponse mapToResponse(Prescription prescription) {
        PrescriptionResponse dto = new PrescriptionResponse();
        dto.setId(prescription.getId());

        // Patient info
        Patient patient = prescription.getPatient();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        dto.setPatientAge(calculateAge(patient.getDateOfBirth()));
        dto.setPatientGender(patient.getGender() != null ? patient.getGender().name() : "N/A");
        dto.setPatientPhone(patient.getPhone());

        // Doctor info
        Doctor doctor = prescription.getDoctor();
        dto.setDoctorId(doctor.getId());
        dto.setDoctorName("Dr. " + doctor.getFirstName() + " " + doctor.getLastName());
        dto.setDoctorSpecialization(doctor.getSpecialization());
        dto.setDoctorLicenseNumber(doctor.getLicenseNumber());
        dto.setHospitalAffiliation(doctor.getHospitalAffiliation());

        // Medical record link
        if (prescription.getMedicalRecord() != null) {
            dto.setMedicalRecordId(prescription.getMedicalRecord().getId());
        }

        dto.setVisitType(prescription.getVisitType());
        dto.setChiefComplaint(prescription.getChiefComplaint());
        dto.setFinalDiagnosis(prescription.getFinalDiagnosis());
        dto.setVitalsBp(prescription.getVitalsBp());
        dto.setVitalsBmi(prescription.getVitalsBmi());
        dto.setVitalsTemperature(prescription.getVitalsTemperature());
        dto.setVitalsPulse(prescription.getVitalsPulse());
        dto.setClinicalNotes(prescription.getClinicalNotes());
        dto.setFollowUpDate(prescription.getFollowUpDate());
        dto.setFollowUpNotes(prescription.getFollowUpNotes());
        dto.setPrescriptionDate(prescription.getPrescriptionDate());
        dto.setPdfPath(prescription.getPdfPath());
        dto.setCreatedAt(prescription.getCreatedAt());

        // Medicines
        if (prescription.getMedicines() != null) {
            dto.setMedicines(prescription.getMedicines().stream().map(med -> {
                PrescriptionResponse.MedicineDetail detail = new PrescriptionResponse.MedicineDetail();
                detail.setId(med.getId());
                detail.setSerialNumber(med.getSerialNumber());
                detail.setMedicineName(med.getMedicineName());
                detail.setGenericName(med.getGenericName());
                detail.setDosage(med.getDosage());
                detail.setFrequency(med.getFrequency());
                detail.setRoute(med.getRoute());
                detail.setTiming(med.getTiming());
                detail.setDuration(med.getDuration());
                detail.setInstructions(med.getInstructions());
                return detail;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
