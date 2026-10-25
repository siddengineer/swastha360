package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospital_onboarding_requests")
public class HospitalOnboardingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hospitalName;

    private String orgType;

    @Column(nullable = false)
    private String contactPerson;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String city;
    private String state;

    private Integer branchesCount = 1;
    private Integer staffCount = 20;

    @Column(length = 1000)
    private String requestedAgents; // comma separated ids or json

    @Column(length = 2000)
    private String intendedUseCases;

    private String existingSoftware;

    @Column(length = 2000)
    private String additionalNotes;

    private boolean consentToContact = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING_REVIEW;

    @Column(length = 1000)
    private String rejectionReason;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public HospitalOnboardingRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getOrgType() { return orgType; }
    public void setOrgType(String orgType) { this.orgType = orgType; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Integer getBranchesCount() { return branchesCount; }
    public void setBranchesCount(Integer branchesCount) { this.branchesCount = branchesCount; }

    public Integer getStaffCount() { return staffCount; }
    public void setStaffCount(Integer staffCount) { this.staffCount = staffCount; }

    public String getRequestedAgents() { return requestedAgents; }
    public void setRequestedAgents(String requestedAgents) { this.requestedAgents = requestedAgents; }

    public String getIntendedUseCases() { return intendedUseCases; }
    public void setIntendedUseCases(String intendedUseCases) { this.intendedUseCases = intendedUseCases; }

    public String getExistingSoftware() { return existingSoftware; }
    public void setExistingSoftware(String existingSoftware) { this.existingSoftware = existingSoftware; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public boolean isConsentToContact() { return consentToContact; }
    public void setConsentToContact(boolean consentToContact) { this.consentToContact = consentToContact; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
