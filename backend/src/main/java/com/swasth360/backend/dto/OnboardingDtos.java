package com.swasth360.backend.dto;

import com.swasth360.backend.entity.RequestStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class OnboardingDtos {

    public static class OnboardingSubmitRequest {
        @NotBlank(message = "Hospital/Clinic name is required")
        private String hospitalName;

        private String orgType;

        @NotBlank(message = "Contact person name is required")
        private String contactPerson;

        @NotBlank(message = "Official email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Phone number is required")
        private String phone;

        private String city;
        private String state;
        private Integer branchesCount = 1;
        private Integer staffCount = 20;

        private List<String> requestedAgents;
        private String intendedUseCases;
        private String existingSoftware;
        private String additionalNotes;
        private boolean consentToContact = true;

        public OnboardingSubmitRequest() {}

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
        public List<String> getRequestedAgents() { return requestedAgents; }
        public void setRequestedAgents(List<String> requestedAgents) { this.requestedAgents = requestedAgents; }
        public String getIntendedUseCases() { return intendedUseCases; }
        public void setIntendedUseCases(String intendedUseCases) { this.intendedUseCases = intendedUseCases; }
        public String getExistingSoftware() { return existingSoftware; }
        public void setExistingSoftware(String existingSoftware) { this.existingSoftware = existingSoftware; }
        public String getAdditionalNotes() { return additionalNotes; }
        public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
        public boolean isConsentToContact() { return consentToContact; }
        public void setConsentToContact(boolean consentToContact) { this.consentToContact = consentToContact; }
    }

    public static class OnboardingResponseDto {
        private Long requestId;
        private String hospitalName;
        private String orgType;
        private String contactPerson;
        private String email;
        private String phone;
        private String city;
        private String state;
        private Integer branchesCount;
        private Integer staffCount;
        private List<String> requestedAgents;
        private String intendedUseCases;
        private String existingSoftware;
        private String additionalNotes;
        private RequestStatus status;
        private String rejectionReason;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public OnboardingResponseDto() {}

        public Long getRequestId() { return requestId; }
        public void setRequestId(Long requestId) { this.requestId = requestId; }
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
        public List<String> getRequestedAgents() { return requestedAgents; }
        public void setRequestedAgents(List<String> requestedAgents) { this.requestedAgents = requestedAgents; }
        public String getIntendedUseCases() { return intendedUseCases; }
        public void setIntendedUseCases(String intendedUseCases) { this.intendedUseCases = intendedUseCases; }
        public String getExistingSoftware() { return existingSoftware; }
        public void setExistingSoftware(String existingSoftware) { this.existingSoftware = existingSoftware; }
        public String getAdditionalNotes() { return additionalNotes; }
        public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
        public RequestStatus getStatus() { return status; }
        public void setStatus(RequestStatus status) { this.status = status; }
        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class StatusUpdateRequest {
        private RequestStatus status;
        private String rejectionReason;

        public StatusUpdateRequest() {}
        public StatusUpdateRequest(RequestStatus status, String rejectionReason) {
            this.status = status;
            this.rejectionReason = rejectionReason;
        }

        public RequestStatus getStatus() { return status; }
        public void setStatus(RequestStatus status) { this.status = status; }
        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    }

    public static class CreateOrgFromRequest {
        private Long requestId;
        @NotBlank(message = "Organization name is required")
        private String name;
        private String uniqueSlug;
        private String orgType;
        private String city;
        private String state;
        private List<String> enabledAgentIds;

        // Initial Hospital Admin credentials
        @NotBlank(message = "Admin email is required")
        @Email(message = "Invalid email format")
        private String adminEmail;
        private String adminFullName;
        private String adminPassword;
        private String adminPhone;

        public CreateOrgFromRequest() {}

        public Long getRequestId() { return requestId; }
        public void setRequestId(Long requestId) { this.requestId = requestId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUniqueSlug() { return uniqueSlug; }
        public void setUniqueSlug(String uniqueSlug) { this.uniqueSlug = uniqueSlug; }
        public String getOrgType() { return orgType; }
        public void setOrgType(String orgType) { this.orgType = orgType; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public List<String> getEnabledAgentIds() { return enabledAgentIds; }
        public void setEnabledAgentIds(List<String> enabledAgentIds) { this.enabledAgentIds = enabledAgentIds; }
        public String getAdminEmail() { return adminEmail; }
        public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }
        public String getAdminFullName() { return adminFullName; }
        public void setAdminFullName(String adminFullName) { this.adminFullName = adminFullName; }
        public String getAdminPassword() { return adminPassword; }
        public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
        public String getAdminPhone() { return adminPhone; }
        public void setAdminPhone(String adminPhone) { this.adminPhone = adminPhone; }
    }
}
