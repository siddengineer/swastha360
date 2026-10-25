package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String uniqueSlug;

    @Column(nullable = false)
    private String name;

    private String type; // e.g. "Multispecialty Hospital", "Super Specialty Hospital", "Clinic"

    private String city;
    private String state;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrgStatus status = OrgStatus.ACTIVE;

    private String contactPerson;
    private String contactEmail;
    private String contactPhone;

    private Integer branchesCount = 1;
    private Integer staffCount = 20;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Organization() {}

    public Organization(String uniqueSlug, String name, String type, String city, String state, OrgStatus status,
                        String contactPerson, String contactEmail, String contactPhone, Integer branchesCount, Integer staffCount) {
        this.uniqueSlug = uniqueSlug;
        this.name = name;
        this.type = type;
        this.city = city;
        this.state = state;
        this.status = status;
        this.contactPerson = contactPerson;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.branchesCount = branchesCount != null ? branchesCount : 1;
        this.staffCount = staffCount != null ? staffCount : 10;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUniqueSlug() { return uniqueSlug; }
    public void setUniqueSlug(String uniqueSlug) { this.uniqueSlug = uniqueSlug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public OrgStatus getStatus() { return status; }
    public void setStatus(OrgStatus status) { this.status = status; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public Integer getBranchesCount() { return branchesCount; }
    public void setBranchesCount(Integer branchesCount) { this.branchesCount = branchesCount; }

    public Integer getStaffCount() { return staffCount; }
    public void setStaffCount(Integer staffCount) { this.staffCount = staffCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
