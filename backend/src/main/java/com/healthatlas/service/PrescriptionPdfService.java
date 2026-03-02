package com.healthatlas.service;

import com.healthatlas.model.Doctor;
import com.healthatlas.model.Patient;
import com.healthatlas.model.Prescription;
import com.healthatlas.model.PrescriptionMedicine;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PrescriptionPdfService {

    @Value("${app.prescriptions.upload-dir:prescriptions}")
    private String prescriptionsDir;

    private static final Color HEALTH_ATLAS_BLUE = new Color(0, 105, 148);
    private static final Color HEALTH_ATLAS_LIGHT_BLUE = new Color(230, 244, 250);
    private static final Color HEADER_BG = new Color(0, 105, 148);
    private static final Color ROW_ALT_BG = new Color(245, 250, 255);
    private static final Color BORDER_COLOR = new Color(180, 200, 220);

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

    public String generatePrescriptionPdf(Prescription prescription) throws Exception {
        Path dir = Paths.get(prescriptionsDir);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        String fileName = "RX_" + prescription.getId() + "_" +
                prescription.getPatient().getFirstName() + "_" +
                prescription.getPrescriptionDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
        Path filePath = dir.resolve(fileName);

        byte[] pdfBytes = generatePrescriptionPdfBytes(prescription);
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(pdfBytes);
        }

        return filePath.toString();
    }

    public byte[] generatePrescriptionPdfBytes(Prescription prescription) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 60);
        PdfWriter writer = PdfWriter.getInstance(document, baos);

        // Add page footer
        writer.setPageEvent(new PrescriptionFooter(prescription));

        document.open();

        addHeader(document, prescription);
        addPatientInfo(document, prescription);
        addVitals(document, prescription);
        addConsultantInfo(document, prescription);
        addChiefComplaintAndDiagnosis(document, prescription);
        addMedicinesTable(document, prescription);
        addFollowUpSection(document, prescription);
        addDoctorSignature(document, prescription);

        document.close();
        return baos.toByteArray();
    }

    private void addHeader(Document document, Prescription prescription) throws DocumentException {
        // Hospital/App Banner
        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);

        PdfPCell bannerCell = new PdfPCell();
        bannerCell.setBackgroundColor(HEADER_BG);
        bannerCell.setPadding(12);
        bannerCell.setBorderWidth(0);
        bannerCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph title = new Paragraph();
        Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, Color.WHITE);
        Font subFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.WHITE);

        title.add(new Chunk("\u2695 HEALTH ATLAS", titleFont));
        title.setAlignment(Element.ALIGN_CENTER);
        bannerCell.addElement(title);

        Paragraph sub = new Paragraph("Medical History & Prescription Management System", subFont);
        sub.setAlignment(Element.ALIGN_CENTER);
        bannerCell.addElement(sub);

        String hospitalName = prescription.getDoctor().getHospitalAffiliation();
        if (hospitalName != null && !hospitalName.isEmpty()) {
            Paragraph hospital = new Paragraph(hospitalName, new Font(Font.HELVETICA, 9, Font.ITALIC, Color.WHITE));
            hospital.setAlignment(Element.ALIGN_CENTER);
            bannerCell.addElement(hospital);
        }

        headerTable.addCell(bannerCell);
        document.add(headerTable);

        // "OUT PATIENT DEPARTMENT" strip
        PdfPTable opdTable = new PdfPTable(1);
        opdTable.setWidthPercentage(100);
        opdTable.setSpacingBefore(2);
        PdfPCell opdCell = new PdfPCell(new Phrase("OUT PATIENT DEPARTMENT",
                new Font(Font.HELVETICA, 11, Font.BOLD, HEALTH_ATLAS_BLUE)));
        opdCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        opdCell.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
        opdCell.setPadding(6);
        opdCell.setBorderColor(BORDER_COLOR);
        opdTable.addCell(opdCell);
        document.add(opdTable);
    }

    private void addPatientInfo(Document document, Prescription prescription) throws DocumentException {
        Patient patient = prescription.getPatient();
        String age = calculateAge(patient.getDateOfBirth());
        String gender = patient.getGender() != null ? patient.getGender().name() : "N/A";

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8);
        table.setWidths(new float[]{1.2f, 1.8f, 1.2f, 1.8f});

        Font labelFont = new Font(Font.HELVETICA, 8, Font.BOLD, HEALTH_ATLAS_BLUE);
        Font valueFont = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK);

        addInfoRow(table, "Patient Name", patient.getFirstName() + " " + patient.getLastName(), labelFont, valueFont);
        addInfoRow(table, "Patient ID", "HA" + String.format("%010d", patient.getId()), labelFont, valueFont);

        addInfoRow(table, "Age/Gender", age + " / " + gender, labelFont, valueFont);
        addInfoRow(table, "Prescription No", "RX" + String.format("%08d", prescription.getId()), labelFont, valueFont);

        addInfoRow(table, "Mobile", patient.getPhone() != null ? patient.getPhone() : "N/A", labelFont, valueFont);
        addInfoRow(table, "Visit Dt.", prescription.getPrescriptionDate().format(DATE_FMT), labelFont, valueFont);

        addInfoRow(table, "Visit Type", prescription.getVisitType() != null ? prescription.getVisitType() : "NORMAL", labelFont, valueFont);
        addInfoRow(table, "Organisation", "HEALTH ATLAS", labelFont, valueFont);

        document.add(table);
    }

    private void addInfoRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label + " :", labelFont));
        labelCell.setBorderColor(BORDER_COLOR);
        labelCell.setPadding(4);
        labelCell.setBackgroundColor(new Color(250, 252, 255));
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorderColor(BORDER_COLOR);
        valueCell.setPadding(4);
        table.addCell(valueCell);
    }

    private void addVitals(Document document, Prescription prescription) throws DocumentException {
        PdfPTable vitalsHeader = new PdfPTable(1);
        vitalsHeader.setWidthPercentage(100);
        vitalsHeader.setSpacingBefore(8);

        PdfPCell headerCell = new PdfPCell(new Phrase("Vitals :",
                new Font(Font.HELVETICA, 9, Font.BOLD, HEALTH_ATLAS_BLUE)));
        headerCell.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
        headerCell.setBorderColor(BORDER_COLOR);
        headerCell.setPadding(4);
        vitalsHeader.addCell(headerCell);
        document.add(vitalsHeader);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1, 1, 1, 1});

        Font headerFont = new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE);
        Font valueFont = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK);

        String[] headers = {"BP", "BMI", "Temperature", "Pulse"};
        String[] values = {
                prescription.getVitalsBp() != null ? prescription.getVitalsBp() : "--",
                prescription.getVitalsBmi() != null ? prescription.getVitalsBmi() : "--",
                prescription.getVitalsTemperature() != null ? prescription.getVitalsTemperature() : "--",
                prescription.getVitalsPulse() != null ? prescription.getVitalsPulse() : "--"
        };

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(HEALTH_ATLAS_BLUE);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(4);
            cell.setBorderColor(BORDER_COLOR);
            table.addCell(cell);
        }
        for (String v : values) {
            PdfPCell cell = new PdfPCell(new Phrase(v, valueFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(4);
            cell.setBorderColor(BORDER_COLOR);
            table.addCell(cell);
        }

        document.add(table);
    }

    private void addConsultantInfo(Document document, Prescription prescription) throws DocumentException {
        Doctor doctor = prescription.getDoctor();

        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8);

        PdfPCell headerCell = new PdfPCell(new Phrase("Consultant :",
                new Font(Font.HELVETICA, 9, Font.BOLD, HEALTH_ATLAS_BLUE)));
        headerCell.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
        headerCell.setBorderColor(BORDER_COLOR);
        headerCell.setPadding(4);
        table.addCell(headerCell);

        // Doctor details
        StringBuilder doctorInfo = new StringBuilder();
        doctorInfo.append("Dr. ").append(doctor.getFirstName()).append(" ").append(doctor.getLastName()).append("\n");
        if (doctor.getSpecialization() != null) {
            doctorInfo.append(doctor.getSpecialization()).append("\n");
        }
        if (doctor.getHospitalAffiliation() != null) {
            doctorInfo.append(doctor.getHospitalAffiliation()).append("\n");
        }
        doctorInfo.append("Reg No: ").append(doctor.getLicenseNumber());

        PdfPCell detailCell = new PdfPCell();
        detailCell.setBorderColor(BORDER_COLOR);
        detailCell.setPadding(6);

        Paragraph doctorName = new Paragraph("Dr. " + doctor.getFirstName() + " " + doctor.getLastName(),
                new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK));
        detailCell.addElement(doctorName);

        if (doctor.getSpecialization() != null) {
            Paragraph spec = new Paragraph(doctor.getSpecialization(),
                    new Font(Font.HELVETICA, 9, Font.NORMAL, Color.DARK_GRAY));
            detailCell.addElement(spec);
        }

        if (doctor.getHospitalAffiliation() != null) {
            Paragraph hosp = new Paragraph(doctor.getHospitalAffiliation(),
                    new Font(Font.HELVETICA, 8, Font.ITALIC, Color.GRAY));
            detailCell.addElement(hosp);
        }

        Paragraph regNo = new Paragraph("Reg No: " + doctor.getLicenseNumber(),
                new Font(Font.HELVETICA, 8, Font.NORMAL, Color.DARK_GRAY));
        detailCell.addElement(regNo);

        table.addCell(detailCell);
        document.add(table);
    }

    private void addChiefComplaintAndDiagnosis(Document document, Prescription prescription) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8);
        table.setWidths(new float[]{1, 1});

        Font sectionFont = new Font(Font.HELVETICA, 9, Font.BOLD, HEALTH_ATLAS_BLUE);
        Font contentFont = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK);

        // Chief Complaint
        PdfPCell ccHeader = new PdfPCell(new Phrase("Chief Complaint :", sectionFont));
        ccHeader.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
        ccHeader.setBorderColor(BORDER_COLOR);
        ccHeader.setPadding(4);
        table.addCell(ccHeader);

        PdfPCell diagHeader = new PdfPCell(new Phrase("Final Diagnosis :", sectionFont));
        diagHeader.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
        diagHeader.setBorderColor(BORDER_COLOR);
        diagHeader.setPadding(4);
        table.addCell(diagHeader);

        PdfPCell ccContent = new PdfPCell(new Phrase(
                prescription.getChiefComplaint() != null ? prescription.getChiefComplaint() : "N/A", contentFont));
        ccContent.setBorderColor(BORDER_COLOR);
        ccContent.setPadding(6);
        ccContent.setMinimumHeight(40);
        table.addCell(ccContent);

        PdfPCell diagContent = new PdfPCell();
        diagContent.setBorderColor(BORDER_COLOR);
        diagContent.setPadding(6);
        diagContent.setMinimumHeight(40);

        Font diagFont = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(180, 0, 0));
        diagContent.addElement(new Phrase(prescription.getFinalDiagnosis(), diagFont));
        table.addCell(diagContent);

        document.add(table);
    }

    private void addMedicinesTable(Document document, Prescription prescription) throws DocumentException {
        // Rx header
        PdfPTable rxHeader = new PdfPTable(1);
        rxHeader.setWidthPercentage(100);
        rxHeader.setSpacingBefore(10);

        Paragraph rxTitle = new Paragraph();
        rxTitle.add(new Chunk("Rx", new Font(Font.HELVETICA, 14, Font.BOLD | Font.ITALIC, HEALTH_ATLAS_BLUE)));
        rxTitle.add(new Chunk("   TOTAL NO. OF MEDICINES: " + prescription.getMedicines().size(),
                new Font(Font.HELVETICA, 9, Font.BOLD, Color.DARK_GRAY)));

        PdfPCell rxCell = new PdfPCell(rxTitle);
        rxCell.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
        rxCell.setBorderColor(BORDER_COLOR);
        rxCell.setPadding(6);
        rxHeader.addCell(rxCell);
        document.add(rxHeader);

        // Medicine table
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(4);
        table.setWidths(new float[]{0.4f, 2.2f, 1f, 0.8f, 1f, 1f});

        // Table headers
        Font headerFont = new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE);
        String[] headers = {"#", "Medicine", "Frequency", "Route", "Timing", "Duration"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(HEALTH_ATLAS_BLUE);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            cell.setBorderColor(BORDER_COLOR);
            table.addCell(cell);
        }

        // Medicine rows
        Font medFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.BLACK);
        Font genericFont = new Font(Font.HELVETICA, 7, Font.ITALIC, Color.GRAY);
        Font normalFont = new Font(Font.HELVETICA, 8, Font.NORMAL, Color.BLACK);
        Font instrFont = new Font(Font.HELVETICA, 7, Font.ITALIC, new Color(180, 0, 0));

        for (int i = 0; i < prescription.getMedicines().size(); i++) {
            PrescriptionMedicine med = prescription.getMedicines().get(i);
            Color rowBg = (i % 2 == 0) ? Color.WHITE : ROW_ALT_BG;

            // Serial number
            PdfPCell numCell = new PdfPCell(new Phrase(String.valueOf(med.getSerialNumber()), normalFont));
            numCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            numCell.setBackgroundColor(rowBg);
            numCell.setPadding(4);
            numCell.setBorderColor(BORDER_COLOR);
            table.addCell(numCell);

            // Medicine name + generic + dosage + instructions
            PdfPCell nameCell = new PdfPCell();
            nameCell.setBackgroundColor(rowBg);
            nameCell.setPadding(4);
            nameCell.setBorderColor(BORDER_COLOR);

            String nameWithDosage = med.getMedicineName();
            if (med.getDosage() != null && !med.getDosage().isEmpty()) {
                nameWithDosage += " " + med.getDosage();
            }
            nameCell.addElement(new Phrase(nameWithDosage, medFont));

            if (med.getGenericName() != null && !med.getGenericName().isEmpty()) {
                nameCell.addElement(new Phrase("Generic: " + med.getGenericName(), genericFont));
            }
            if (med.getInstructions() != null && !med.getInstructions().isEmpty()) {
                nameCell.addElement(new Phrase("Note: " + med.getInstructions(), instrFont));
            }
            table.addCell(nameCell);

            // Frequency
            PdfPCell freqCell = new PdfPCell(new Phrase(med.getFrequency(), normalFont));
            freqCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            freqCell.setBackgroundColor(rowBg);
            freqCell.setPadding(4);
            freqCell.setBorderColor(BORDER_COLOR);
            table.addCell(freqCell);

            // Route
            PdfPCell routeCell = new PdfPCell(new Phrase(
                    med.getRoute() != null ? med.getRoute() : "ORAL", normalFont));
            routeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            routeCell.setBackgroundColor(rowBg);
            routeCell.setPadding(4);
            routeCell.setBorderColor(BORDER_COLOR);
            table.addCell(routeCell);

            // Timing
            PdfPCell timingCell = new PdfPCell(new Phrase(
                    med.getTiming() != null ? med.getTiming() : "After Food", normalFont));
            timingCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            timingCell.setBackgroundColor(rowBg);
            timingCell.setPadding(4);
            timingCell.setBorderColor(BORDER_COLOR);
            table.addCell(timingCell);

            // Duration
            PdfPCell durCell = new PdfPCell(new Phrase(med.getDuration(), normalFont));
            durCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            durCell.setBackgroundColor(rowBg);
            durCell.setPadding(4);
            durCell.setBorderColor(BORDER_COLOR);
            table.addCell(durCell);
        }

        document.add(table);
    }

    private void addFollowUpSection(Document document, Prescription prescription) throws DocumentException {
        if (prescription.getFollowUpDate() == null && prescription.getClinicalNotes() == null) return;

        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        Font sectionFont = new Font(Font.HELVETICA, 9, Font.BOLD, HEALTH_ATLAS_BLUE);
        Font contentFont = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK);

        // Clinical notes
        if (prescription.getClinicalNotes() != null && !prescription.getClinicalNotes().isEmpty()) {
            PdfPCell notesHeader = new PdfPCell(new Phrase("Clinical Notes :", sectionFont));
            notesHeader.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
            notesHeader.setBorderColor(BORDER_COLOR);
            notesHeader.setPadding(4);
            table.addCell(notesHeader);

            PdfPCell notesCell = new PdfPCell(new Phrase(prescription.getClinicalNotes(), contentFont));
            notesCell.setBorderColor(BORDER_COLOR);
            notesCell.setPadding(6);
            table.addCell(notesCell);
        }

        // Follow-up
        if (prescription.getFollowUpDate() != null) {
            PdfPCell followHeader = new PdfPCell(new Phrase("Follow Up :", sectionFont));
            followHeader.setBackgroundColor(HEALTH_ATLAS_LIGHT_BLUE);
            followHeader.setBorderColor(BORDER_COLOR);
            followHeader.setPadding(4);
            table.addCell(followHeader);

            String followText = "Follow-up Date: " + prescription.getFollowUpDate().format(DATE_FMT);
            if (prescription.getFollowUpNotes() != null && !prescription.getFollowUpNotes().isEmpty()) {
                followText += "\n" + prescription.getFollowUpNotes();
            }

            PdfPCell followCell = new PdfPCell(new Phrase(followText, contentFont));
            followCell.setBorderColor(BORDER_COLOR);
            followCell.setPadding(6);
            table.addCell(followCell);
        }

        document.add(table);
    }

    private void addDoctorSignature(Document document, Prescription prescription) throws DocumentException {
        Doctor doctor = prescription.getDoctor();

        document.add(new Paragraph("\n"));

        PdfPTable sigTable = new PdfPTable(2);
        sigTable.setWidthPercentage(100);
        sigTable.setSpacingBefore(20);
        sigTable.setWidths(new float[]{1, 1});

        Font smallFont = new Font(Font.HELVETICA, 8, Font.NORMAL, Color.GRAY);
        Font sigFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.BLACK);

        // Date + Time
        PdfPCell dateCell = new PdfPCell();
        dateCell.setBorderWidth(0);
        dateCell.setPadding(4);
        dateCell.addElement(new Phrase("Date: " + prescription.getPrescriptionDate().format(DATE_FMT), smallFont));
        sigTable.addCell(dateCell);

        // Doctor signature
        PdfPCell sigCell = new PdfPCell();
        sigCell.setBorderWidth(0);
        sigCell.setPadding(4);
        sigCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph sigLine = new Paragraph("_________________________", smallFont);
        sigLine.setAlignment(Element.ALIGN_RIGHT);
        sigCell.addElement(sigLine);

        Paragraph docName = new Paragraph("Dr. " + doctor.getFirstName() + " " + doctor.getLastName(), sigFont);
        docName.setAlignment(Element.ALIGN_RIGHT);
        sigCell.addElement(docName);

        Paragraph reg = new Paragraph("Reg No: " + doctor.getLicenseNumber(), smallFont);
        reg.setAlignment(Element.ALIGN_RIGHT);
        sigCell.addElement(reg);

        sigTable.addCell(sigCell);
        document.add(sigTable);
    }

    private String calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) return "N/A";
        Period period = Period.between(dateOfBirth, LocalDate.now());
        if (period.getMonths() > 0) {
            return period.getYears() + "Years, " + period.getMonths() + "Months";
        }
        return period.getYears() + " Years";
    }

    // Footer with branding on each page
    static class PrescriptionFooter extends PdfPageEventHelper {
        private final Prescription prescription;

        PrescriptionFooter(Prescription prescription) {
            this.prescription = prescription;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            Font footerFont = new Font(Font.HELVETICA, 7, Font.NORMAL, Color.GRAY);
            Font boldFooter = new Font(Font.HELVETICA, 7, Font.BOLD, new Color(0, 105, 148));

            Doctor doctor = prescription.getDoctor();
            String doctorLine = "Dr. " + doctor.getFirstName() + " " + doctor.getLastName()
                    + " | Reg No: " + doctor.getLicenseNumber();

            // Doctor info line
            Phrase docPhrase = new Phrase(doctorLine, boldFooter);
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT, docPhrase,
                    document.leftMargin(), document.bottomMargin() - 10, 0);

            // App branding
            Phrase brandPhrase = new Phrase("Health Atlas - Medical Management System", footerFont);
            ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT, brandPhrase,
                    document.right(), document.bottomMargin() - 10, 0);

            // Page number
            String dateStr = "Generated: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));
            Phrase dateLine = new Phrase(dateStr + "  |  Page " + writer.getPageNumber(), footerFont);
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, dateLine,
                    (document.right() + document.left()) / 2, document.bottomMargin() - 22, 0);
        }
    }
}
