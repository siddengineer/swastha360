package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long organizationId;

    @Column(nullable = false)
    private String appointmentRef; // e.g. "APT-9041"

    @Column(nullable = false)
    private String patientNameRef; // Fictional, e.g. "P. Sharma (Ref #PT-8421)"

    private String department;
    private String doctorName;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String status = "SCHEDULED"; // SCHEDULED, CONFIRMED, COMPLETED, CANCELLED

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Appointment() {}

    public Appointment(Long organizationId, String appointmentRef, String patientNameRef, String department,
                       String doctorName, LocalDate appointmentDate, String timeSlot, String status, String notes) {
        this.organizationId = organizationId;
        this.appointmentRef = appointmentRef;
        this.patientNameRef = patientNameRef;
        this.department = department;
        this.doctorName = doctorName;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getAppointmentRef() { return appointmentRef; }
    public void setAppointmentRef(String appointmentRef) { this.appointmentRef = appointmentRef; }

    public String getPatientNameRef() { return patientNameRef; }
    public void setPatientNameRef(String patientNameRef) { this.patientNameRef = patientNameRef; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
