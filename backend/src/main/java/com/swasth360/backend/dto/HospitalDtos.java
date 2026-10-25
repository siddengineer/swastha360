package com.swasth360.backend.dto;

import com.swasth360.backend.dto.AgentDtos.AgentDto;
import com.swasth360.backend.entity.OrgStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class HospitalDtos {

    public static class HospitalDashboardDto {
        private Long organizationId;
        private String organizationName;
        private String organizationSlug;
        private OrgStatus status;
        private int enabledAgentsCount;
        private int activeStaffCount;
        private int upcomingAppointmentsCount;
        private int pendingFollowUpsCount;
        private List<AgentDto> enabledAgents;
        private List<AppointmentDto> recentAppointments;
        private List<FollowUpDto> pendingFollowUps;
        private HelpdeskSettingsDto helpdeskSettings;

        public HospitalDashboardDto() {}

        public Long getOrganizationId() { return organizationId; }
        public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
        public String getOrganizationSlug() { return organizationSlug; }
        public void setOrganizationSlug(String organizationSlug) { this.organizationSlug = organizationSlug; }
        public OrgStatus getStatus() { return status; }
        public void setStatus(OrgStatus status) { this.status = status; }
        public int getEnabledAgentsCount() { return enabledAgentsCount; }
        public void setEnabledAgentsCount(int enabledAgentsCount) { this.enabledAgentsCount = enabledAgentsCount; }
        public int getActiveStaffCount() { return activeStaffCount; }
        public void setActiveStaffCount(int activeStaffCount) { this.activeStaffCount = activeStaffCount; }
        public int getUpcomingAppointmentsCount() { return upcomingAppointmentsCount; }
        public void setUpcomingAppointmentsCount(int upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; }
        public int getPendingFollowUpsCount() { return pendingFollowUpsCount; }
        public void setPendingFollowUpsCount(int pendingFollowUpsCount) { this.pendingFollowUpsCount = pendingFollowUpsCount; }
        public List<AgentDto> getEnabledAgents() { return enabledAgents; }
        public void setEnabledAgents(List<AgentDto> enabledAgents) { this.enabledAgents = enabledAgents; }
        public List<AppointmentDto> getRecentAppointments() { return recentAppointments; }
        public void setRecentAppointments(List<AppointmentDto> recentAppointments) { this.recentAppointments = recentAppointments; }
        public List<FollowUpDto> getPendingFollowUps() { return pendingFollowUps; }
        public void setPendingFollowUps(List<FollowUpDto> pendingFollowUps) { this.pendingFollowUps = pendingFollowUps; }
        public HelpdeskSettingsDto getHelpdeskSettings() { return helpdeskSettings; }
        public void setHelpdeskSettings(HelpdeskSettingsDto helpdeskSettings) { this.helpdeskSettings = helpdeskSettings; }
    }

    public static class AppointmentDto {
        private Long id;
        private String appointmentRef;
        private String patientNameRef;
        private String department;
        private String doctorName;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String status;
        private String notes;

        public AppointmentDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
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
    }

    public static class FollowUpDto {
        private Long id;
        private String patientNameRef;
        private String procedureOrDiagnosis;
        private LocalDate followUpDate;
        private String assignedStaffName;
        private String status;
        private String notes;

        public FollowUpDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
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
    }

    public static class StaffMemberDto {
        private Long membershipId;
        private Long userId;
        private String email;
        private String fullName;
        private String phone;
        private String roleTitle;
        private String department;
        private boolean active;
        private LocalDateTime joinedAt;

        public StaffMemberDto() {}

        public Long getMembershipId() { return membershipId; }
        public void setMembershipId(Long membershipId) { this.membershipId = membershipId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRoleTitle() { return roleTitle; }
        public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
    }

    public static class InviteStaffRequest {
        private String fullName;
        private String email;
        private String password;
        private String phone;
        private String roleTitle;
        private String department;
        private String role; // "HOSPITAL_STAFF" or "HOSPITAL_ADMIN"

        public InviteStaffRequest() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRoleTitle() { return roleTitle; }
        public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class HelpdeskSettingsDto {
        private String visitingHours;
        private String appointmentInstructions;
        private String contactPhone;
        private String contactEmail;
        private String generalFaq;

        public HelpdeskSettingsDto() {}
        public HelpdeskSettingsDto(String visitingHours, String appointmentInstructions, String contactPhone, String contactEmail, String generalFaq) {
            this.visitingHours = visitingHours;
            this.appointmentInstructions = appointmentInstructions;
            this.contactPhone = contactPhone;
            this.contactEmail = contactEmail;
            this.generalFaq = generalFaq;
        }

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
    }
}
