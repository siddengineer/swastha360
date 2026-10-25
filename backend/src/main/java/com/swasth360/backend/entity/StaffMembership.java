package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_memberships",
       uniqueConstraints = @UniqueConstraint(columnNames = {"organizationId", "userId"}))
public class StaffMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long organizationId;

    @Column(nullable = false)
    private Long userId;

    private String roleTitle; // e.g. "Senior Staff Nurse", "OPD Executive", "Duty Medical Officer"
    private String department; // e.g. "Cardiology OPD", "General Surgery", "Frontdesk"

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public StaffMembership() {}

    public StaffMembership(Long organizationId, Long userId, String roleTitle, String department) {
        this.organizationId = organizationId;
        this.userId = userId;
        this.roleTitle = roleTitle;
        this.department = department;
        this.active = true;
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
