package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organization_agents",
       uniqueConstraints = @UniqueConstraint(columnNames = {"organizationId", "agentId"}))
public class OrganizationAgent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long organizationId;

    @Column(nullable = false)
    private String agentId;

    @Column(nullable = false)
    private boolean isEnabled = true;

    private LocalDateTime enabledAt = LocalDateTime.now();
    private LocalDateTime disabledAt;

    public OrganizationAgent() {}

    public OrganizationAgent(Long organizationId, String agentId, boolean isEnabled) {
        this.organizationId = organizationId;
        this.agentId = agentId;
        this.isEnabled = isEnabled;
        this.enabledAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getAgentId() { return agentId; }
    public void setAgentId(String agentId) { this.agentId = agentId; }

    public boolean isEnabled() { return isEnabled; }
    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
        if (enabled) {
            this.enabledAt = LocalDateTime.now();
            this.disabledAt = null;
        } else {
            this.disabledAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getEnabledAt() { return enabledAt; }
    public void setEnabledAt(LocalDateTime enabledAt) { this.enabledAt = enabledAt; }

    public LocalDateTime getDisabledAt() { return disabledAt; }
    public void setDisabledAt(LocalDateTime disabledAt) { this.disabledAt = disabledAt; }
}
