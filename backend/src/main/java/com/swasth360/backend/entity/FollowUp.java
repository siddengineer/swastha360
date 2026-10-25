package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "follow_ups")
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long organizationId;

    @Column(nullable = false)
    private String patientNameRef; // Fictional, e.g. "A. Kumar (#PT-8421)"

    private String procedureOrDiagnosis; // e.g. "Laparoscopic Cholecystectomy Post-Op"
    private LocalDate followUpDate;
    private String assignedStaffName;
    private String status = "PENDING"; // PENDING, CALL_ATTEMPTED, COMPLETED, FLAGGED

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FollowUp() {}

    public FollowUp(Long organizationId, String patientNameRef, String procedureOrDiagnosis,
                    LocalDate followUpDate, String assignedStaffName, String status, String notes) {
        this.organizationId = organizationId;
        this.patientNameRef = patientNameRef;
        this.procedureOrDiagnosis = procedureOrDiagnosis;
        this.followUpDate = followUpDate;
        this.assignedStaffName = assignedStaffName;
        this.status = status;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getPatientNameRef() { return patientNameRef; }
    public void setPatientNameRef(String patientNameRef) { this.patientNameRef = patientNameRef; }

    public String getProcedureOrDiagnosis() { return procedureOrDiagnosis; }
    public void setProcedureOrDiagnosis(String procedureOrDiagnosis) { this.procedureOrDiagnosis = procedureOrDiagnosis; }

    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }

    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
