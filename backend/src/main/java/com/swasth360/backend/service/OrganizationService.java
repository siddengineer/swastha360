package com.swasth360.backend.service;

import com.swasth360.backend.dto.OnboardingDtos.CreateOrgFromRequest;
import com.swasth360.backend.dto.OrganizationDtos.*;
import com.swasth360.backend.entity.*;
import com.swasth360.backend.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationAgentRepository organizationAgentRepository;
    private final HospitalOnboardingRequestRepository onboardingRequestRepository;
    private final UserRepository userRepository;
    private final HelpdeskEntryRepository helpdeskEntryRepository;
    private final StaffMembershipRepository staffMembershipRepository;
    private final PasswordEncoder passwordEncoder;

    public OrganizationService(OrganizationRepository organizationRepository,
                               OrganizationAgentRepository organizationAgentRepository,
                               HospitalOnboardingRequestRepository onboardingRequestRepository,
                               UserRepository userRepository,
                               HelpdeskEntryRepository helpdeskEntryRepository,
                               StaffMembershipRepository staffMembershipRepository,
                               PasswordEncoder passwordEncoder) {
        this.organizationRepository = organizationRepository;
        this.organizationAgentRepository = organizationAgentRepository;
        this.onboardingRequestRepository = onboardingRequestRepository;
        this.userRepository = userRepository;
        this.helpdeskEntryRepository = helpdeskEntryRepository;
        this.staffMembershipRepository = staffMembershipRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public OrgDetailDto createOrganization(CreateOrgFromRequest request) {
        // Generate or sanitize unique slug
        String slug = request.getUniqueSlug();
        if (slug == null || slug.isBlank()) {
            slug = request.getName().toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-|-$", "");
        }
        if (organizationRepository.existsByUniqueSlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis() % 10000;
        }

        Organization org = new Organization();
        org.setName(request.getName().trim());
        org.setUniqueSlug(slug);
        org.setType(request.getOrgType() != null ? request.getOrgType() : "Multispecialty Hospital");
        org.setCity(request.getCity());
        org.setState(request.getState());
        org.setStatus(OrgStatus.ACTIVE);
        org.setContactPerson(request.getAdminFullName());
        org.setContactEmail(request.getAdminEmail().toLowerCase().trim());
        org.setContactPhone(request.getAdminPhone());
        org.setBranchesCount(1);
        org.setStaffCount(15);
        org.setCreatedAt(LocalDateTime.now());
        org.setUpdatedAt(LocalDateTime.now());

        org = organizationRepository.save(org);

        // Assign enabled agents
        List<String> enabledAgents = request.getEnabledAgentIds();
        if (enabledAgents == null || enabledAgents.isEmpty()) {
            enabledAgents = List.of("patient-followup", "appointment-management", "hospital-helpdesk");
        }
        for (String agentId : enabledAgents) {
            OrganizationAgent oa = new OrganizationAgent(org.getId(), agentId, true);
            organizationAgentRepository.save(oa);
        }

        // Create or assign initial Hospital Admin
        String adminEmail = request.getAdminEmail().toLowerCase().trim();
        Optional<User> existingUserOpt = userRepository.findByEmail(adminEmail);
        User adminUser;
        if (existingUserOpt.isPresent()) {
            adminUser = existingUserOpt.get();
            adminUser.setRole(Role.HOSPITAL_ADMIN);
            adminUser.setOrganizationId(org.getId());
        } else {
            String rawPassword = (request.getAdminPassword() != null && !request.getAdminPassword().isBlank())
                    ? request.getAdminPassword()
                    : "Hospital@123";
            adminUser = new User(
                    adminEmail,
                    passwordEncoder.encode(rawPassword),
                    request.getAdminFullName() != null ? request.getAdminFullName() : "Hospital Administrator",
                    request.getAdminPhone(),
                    Role.HOSPITAL_ADMIN,
                    org.getId()
            );
        }
        adminUser = userRepository.save(adminUser);

        // Add staff membership record
        StaffMembership adminMembership = new StaffMembership(org.getId(), adminUser.getId(), "Medical Director / Admin", "Administration");
        staffMembershipRepository.save(adminMembership);

        // Seed default hospital helpdesk entry
        HelpdeskEntry helpdesk = new HelpdeskEntry(
                org.getId(),
                "General: 5:00 PM – 7:00 PM daily | ICU: 11:00 AM – 12:00 PM",
                "Please report 20 minutes prior to your appointment at OPD Counter 2 with Government Photo ID (Aadhaar / ABHA).",
                org.getContactPhone() != null ? org.getContactPhone() : "+91 11-4567-8900",
                org.getContactEmail() != null ? org.getContactEmail() : adminEmail,
                "Q: How do I request an ambulance? A: Dial emergency extension 108 or our 24x7 desk."
        );
        helpdeskEntryRepository.save(helpdesk);

        // Mark associated onboarding request as APPROVED if provided
        if (request.getRequestId() != null) {
            onboardingRequestRepository.findById(request.getRequestId()).ifPresent(req -> {
                req.setStatus(RequestStatus.APPROVED);
                req.setUpdatedAt(LocalDateTime.now());
                onboardingRequestRepository.save(req);
            });
        }

        return getOrganizationById(org.getId());
    }

    @Transactional(readOnly = true)
    public List<OrganizationSummaryDto> getAllOrganizations() {
        return organizationRepository.findAll().stream()
                .map(org -> {
                    OrganizationSummaryDto dto = new OrganizationSummaryDto();
                    dto.setId(org.getId());
                    dto.setUniqueSlug(org.getUniqueSlug());
                    dto.setName(org.getName());
                    dto.setType(org.getType());
                    dto.setCity(org.getCity());
                    dto.setState(org.getState());
                    dto.setStatus(org.getStatus());
                    dto.setStaffCount(org.getStaffCount());
                    dto.setCreatedAt(org.getCreatedAt());

                    long enabledCount = organizationAgentRepository.findByOrganizationId(org.getId()).stream()
                            .filter(OrganizationAgent::isEnabled)
                            .count();
                    dto.setEnabledAgentsCount((int) enabledCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrgDetailDto getOrganizationById(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization #" + id + " not found"));

        List<String> enabledAgents = organizationAgentRepository.findByOrganizationId(org.getId()).stream()
                .filter(OrganizationAgent::isEnabled)
                .map(OrganizationAgent::getAgentId)
                .collect(Collectors.toList());

        OrgDetailDto dto = new OrgDetailDto();
        dto.setId(org.getId());
        dto.setUniqueSlug(org.getUniqueSlug());
        dto.setName(org.getName());
        dto.setType(org.getType());
        dto.setCity(org.getCity());
        dto.setState(org.getState());
        dto.setStatus(org.getStatus());
        dto.setContactPerson(org.getContactPerson());
        dto.setContactEmail(org.getContactEmail());
        dto.setContactPhone(org.getContactPhone());
        dto.setBranchesCount(org.getBranchesCount());
        dto.setStaffCount(org.getStaffCount());
        dto.setEnabledAgentIds(enabledAgents);
        dto.setCreatedAt(org.getCreatedAt());
        return dto;
    }

    @Transactional
    public OrgDetailDto updateOrgAgents(Long id, UpdateOrgAgentsRequest request) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization #" + id + " not found"));

        List<OrganizationAgent> existing = organizationAgentRepository.findByOrganizationId(id);
        List<String> desired = request.getEnabledAgentIds() != null ? request.getEnabledAgentIds() : List.of();

        // Update or disable existing
        for (OrganizationAgent oa : existing) {
            boolean shouldBeEnabled = desired.contains(oa.getAgentId());
            oa.setEnabled(shouldBeEnabled);
            organizationAgentRepository.save(oa);
        }

        // Add newly selected ones
        List<String> existingAgentIds = existing.stream().map(OrganizationAgent::getAgentId).toList();
        for (String desiredId : desired) {
            if (!existingAgentIds.contains(desiredId)) {
                OrganizationAgent newOa = new OrganizationAgent(id, desiredId, true);
                organizationAgentRepository.save(newOa);
            }
        }

        org.setUpdatedAt(LocalDateTime.now());
        organizationRepository.save(org);

        return getOrganizationById(id);
    }

    @Transactional
    public OrgDetailDto updateOrgStatus(Long id, UpdateOrgStatusRequest request) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization #" + id + " not found"));

        org.setStatus(request.getStatus());
        org.setUpdatedAt(LocalDateTime.now());
        org = organizationRepository.save(org);

        return getOrganizationById(id);
    }
}
