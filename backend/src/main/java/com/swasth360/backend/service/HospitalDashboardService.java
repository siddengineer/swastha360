package com.swasth360.backend.service;

import com.swasth360.backend.dto.AgentDtos.AgentDto;
import com.swasth360.backend.dto.HospitalDtos.*;
import com.swasth360.backend.entity.*;
import com.swasth360.backend.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HospitalDashboardService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationAgentRepository organizationAgentRepository;
    private final AgentRepository agentRepository;
    private final AppointmentRepository appointmentRepository;
    private final FollowUpRepository followUpRepository;
    private final StaffMembershipRepository staffMembershipRepository;
    private final UserRepository userRepository;
    private final HelpdeskEntryRepository helpdeskEntryRepository;

    public HospitalDashboardService(OrganizationRepository organizationRepository,
                                  OrganizationAgentRepository organizationAgentRepository,
                                  AgentRepository agentRepository,
                                  AppointmentRepository appointmentRepository,
                                  FollowUpRepository followUpRepository,
                                  StaffMembershipRepository staffMembershipRepository,
                                  UserRepository userRepository,
                                  HelpdeskEntryRepository helpdeskEntryRepository) {
        this.organizationRepository = organizationRepository;
        this.organizationAgentRepository = organizationAgentRepository;
        this.agentRepository = agentRepository;
        this.appointmentRepository = appointmentRepository;
        this.followUpRepository = followUpRepository;
        this.staffMembershipRepository = staffMembershipRepository;
        this.userRepository = userRepository;
        this.helpdeskEntryRepository = helpdeskEntryRepository;
    }

    @Transactional(readOnly = true)
    public HospitalDashboardDto getDashboardData(Long orgId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Hospital organization not found"));

        if (org.getStatus() == OrgStatus.SUSPENDED) {
            throw new AccessDeniedException("Organization account is suspended. Please contact Swasth360 administration.");
        }

        Set<String> enabledAgentIds = organizationAgentRepository.findByOrganizationId(orgId).stream()
                .filter(OrganizationAgent::isEnabled)
                .map(OrganizationAgent::getAgentId)
                .collect(Collectors.toSet());

        List<AgentDto> enabledAgents = agentRepository.findAll().stream()
                .filter(a -> enabledAgentIds.contains(a.getId()))
                .map(a -> new AgentDto(a.getId(), a.getName(), a.getDescription(), a.getCategory(),
                        a.getIntendedUsers(), a.isHospitalAgent(), a.isIndividualAgent(),
                        a.getDefaultAvailability(), a.getIconName(), true))
                .collect(Collectors.toList());

        List<AppointmentDto> appointments = getAppointments(orgId);
        List<FollowUpDto> followUps = getFollowUps(orgId);
        List<StaffMemberDto> staff = getStaff(orgId);
        HelpdeskSettingsDto helpdesk = getHelpdeskSettings(orgId);

        HospitalDashboardDto dto = new HospitalDashboardDto();
        dto.setOrganizationId(org.getId());
        dto.setOrganizationName(org.getName());
        dto.setOrganizationSlug(org.getUniqueSlug());
        dto.setStatus(org.getStatus());
        dto.setEnabledAgentsCount(enabledAgents.size());
        dto.setActiveStaffCount(staff.size());
        dto.setUpcomingAppointmentsCount(appointments.size());
        dto.setPendingFollowUpsCount(followUps.size());
        dto.setEnabledAgents(enabledAgents);
        dto.setRecentAppointments(appointments);
        dto.setPendingFollowUps(followUps);
        dto.setHelpdeskSettings(helpdesk);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAppointments(Long orgId) {
        return appointmentRepository.findByOrganizationIdOrderByAppointmentDateDesc(orgId).stream()
                .map(a -> {
                    AppointmentDto dto = new AppointmentDto();
                    dto.setId(a.getId());
                    dto.setAppointmentRef(a.getAppointmentRef());
                    dto.setPatientNameRef(a.getPatientNameRef());
                    dto.setDepartment(a.getDepartment());
                    dto.setDoctorName(a.getDoctorName());
                    dto.setAppointmentDate(a.getAppointmentDate());
                    dto.setTimeSlot(a.getTimeSlot());
                    dto.setStatus(a.getStatus());
                    dto.setNotes(a.getNotes());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FollowUpDto> getFollowUps(Long orgId) {
        return followUpRepository.findByOrganizationIdOrderByFollowUpDateAsc(orgId).stream()
                .map(f -> {
                    FollowUpDto dto = new FollowUpDto();
                    dto.setId(f.getId());
                    dto.setPatientNameRef(f.getPatientNameRef());
                    dto.setProcedureOrDiagnosis(f.getProcedureOrDiagnosis());
                    dto.setFollowUpDate(f.getFollowUpDate());
                    dto.setAssignedStaffName(f.getAssignedStaffName());
                    dto.setStatus(f.getStatus());
                    dto.setNotes(f.getNotes());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffMemberDto> getStaff(Long orgId) {
        return staffMembershipRepository.findByOrganizationId(orgId).stream()
                .map(m -> {
                    User u = userRepository.findById(m.getUserId()).orElse(null);
                    StaffMemberDto dto = new StaffMemberDto();
                    dto.setMembershipId(m.getId());
                    dto.setUserId(m.getUserId());
                    if (u != null) {
                        dto.setEmail(u.getEmail());
                        dto.setFullName(u.getFullName());
                        dto.setPhone(u.getPhone());
                    }
                    dto.setRoleTitle(m.getRoleTitle());
                    dto.setDepartment(m.getDepartment());
                    dto.setActive(m.isActive());
                    dto.setJoinedAt(m.getJoinedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HelpdeskSettingsDto getHelpdeskSettings(Long orgId) {
        return helpdeskEntryRepository.findByOrganizationId(orgId)
                .map(h -> new HelpdeskSettingsDto(
                        h.getVisitingHours(),
                        h.getAppointmentInstructions(),
                        h.getContactPhone(),
                        h.getContactEmail(),
                        h.getGeneralFaq()
                ))
                .orElseGet(() -> new HelpdeskSettingsDto(
                        "5:00 PM – 7:00 PM Daily",
                        "Please arrive 20 minutes prior to your slot at OPD Counter 2.",
                        "+91 11-4567-8900",
                        "helpdesk@hospital.demo",
                        "General assistance counter on Ground floor."
                ));
    }

    @Transactional
    public HelpdeskSettingsDto updateHelpdeskSettings(Long orgId, HelpdeskSettingsDto request) {
        HelpdeskEntry entry = helpdeskEntryRepository.findByOrganizationId(orgId)
                .orElse(new HelpdeskEntry());

        entry.setOrganizationId(orgId);
        entry.setVisitingHours(request.getVisitingHours());
        entry.setAppointmentInstructions(request.getAppointmentInstructions());
        entry.setContactPhone(request.getContactPhone());
        entry.setContactEmail(request.getContactEmail());
        entry.setGeneralFaq(request.getGeneralFaq());
        entry.setUpdatedAt(LocalDateTime.now());

        helpdeskEntryRepository.save(entry);
        return request;
    }
}
