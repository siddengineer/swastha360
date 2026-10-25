package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "helpdesk_entries")
public class HelpdeskEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long organizationId;

    @Column(length = 1000)
    private String visitingHours;

    @Column(length = 2000)
    private String appointmentInstructions;

    private String contactPhone;
    private String contactEmail;

    @Column(length = 4000)
    private String generalFaq;

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public HelpdeskEntry() {}

    public HelpdeskEntry(Long organizationId, String visitingHours, String appointmentInstructions,
                         String contactPhone, String contactEmail, String generalFaq) {
        this.organizationId = organizationId;
        this.visitingHours = visitingHours;
        this.appointmentInstructions = appointmentInstructions;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.generalFaq = generalFaq;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getVisitingHours() { return visitingHours; }
    public void setVisitingHours(String visitingHours) { this.visitingHours = visitingHours; }

    public String getAppointmentInstructions() { return appointmentInstructions; }
    public void setAppointmentInstructions(String appointmentInstructions) { this.appointmentInstructions = appointmentInstructions; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getGeneralFaq() { return generalFaq; }
    public void setGeneralFaq(String generalFaq) { this.generalFaq = generalFaq; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
