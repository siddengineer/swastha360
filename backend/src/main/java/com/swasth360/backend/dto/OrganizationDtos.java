package com.swasth360.backend.dto;

import com.swasth360.backend.entity.OrgStatus;
import java.time.LocalDateTime;
import java.util.List;

public class OrganizationDtos {

    public static class OrganizationSummaryDto {
        private Long id;
        private String uniqueSlug;
        private String name;
        private String type;
        private String city;
        private String state;
        private OrgStatus status;
        private Integer enabledAgentsCount;
        private Integer staffCount;
        private LocalDateTime createdAt;

        public OrganizationSummaryDto() {}

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
        public Integer getEnabledAgentsCount() { return enabledAgentsCount; }
        public void setEnabledAgentsCount(Integer enabledAgentsCount) { this.enabledAgentsCount = enabledAgentsCount; }
        public Integer getStaffCount() { return staffCount; }
        public void setStaffCount(Integer staffCount) { this.staffCount = staffCount; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class OrgDetailDto {
        private Long id;
        private String uniqueSlug;
        private String name;
        private String type;
        private String city;
        private String state;
        private OrgStatus status;
        private String contactPerson;
        private String contactEmail;
        private String contactPhone;
        private Integer branchesCount;
        private Integer staffCount;
        private List<String> enabledAgentIds;
        private LocalDateTime createdAt;

        public OrgDetailDto() {}

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
        public List<String> getEnabledAgentIds() { return enabledAgentIds; }
        public void setEnabledAgentIds(List<String> enabledAgentIds) { this.enabledAgentIds = enabledAgentIds; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class UpdateOrgAgentsRequest {
        private List<String> enabledAgentIds;

        public UpdateOrgAgentsRequest() {}
        public UpdateOrgAgentsRequest(List<String> enabledAgentIds) { this.enabledAgentIds = enabledAgentIds; }

        public List<String> getEnabledAgentIds() { return enabledAgentIds; }
        public void setEnabledAgentIds(List<String> enabledAgentIds) { this.enabledAgentIds = enabledAgentIds; }
    }

    public static class UpdateOrgStatusRequest {
        private OrgStatus status;

        public UpdateOrgStatusRequest() {}
        public UpdateOrgStatusRequest(OrgStatus status) { this.status = status; }

        public OrgStatus getStatus() { return status; }
        public void setStatus(OrgStatus status) { this.status = status; }
    }
}
