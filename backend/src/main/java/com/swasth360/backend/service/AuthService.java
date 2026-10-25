package com.swasth360.backend.service;

import com.swasth360.backend.config.JwtTokenProvider;
import com.swasth360.backend.dto.AuthDtos.*;
import com.swasth360.backend.dto.HospitalDtos.InviteStaffRequest;
import com.swasth360.backend.dto.HospitalDtos.StaffMemberDto;
import com.swasth360.backend.entity.*;
import com.swasth360.backend.repository.OrganizationRepository;
import com.swasth360.backend.repository.StaffMembershipRepository;
import com.swasth360.backend.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final StaffMembershipRepository staffMembershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       StaffMembershipRepository staffMembershipRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.staffMembershipRepository = staffMembershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse registerIndividual(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getPhone(),
                Role.INDIVIDUAL_USER,
                null // B2C account has NO hospital organization association
        );

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user);

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(),
                user.getRole(), null, null, null);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("Your account has been deactivated. Please contact support.");
        }

        String orgName = null;
        String orgSlug = null;

        // If user belongs to an organization, verify organization status
        if (user.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(user.getOrganizationId())
                    .orElseThrow(() -> new IllegalStateException("Associated organization not found"));

            if (org.getStatus() == OrgStatus.SUSPENDED) {
                throw new IllegalStateException("Access suspended: Your hospital organization is currently suspended.");
            }

            orgName = org.getName();
            orgSlug = org.getUniqueSlug();
        }

        String token = tokenProvider.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(),
                user.getRole(), user.getOrganizationId(), orgName, orgSlug);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String orgName = null;
        if (user.getOrganizationId() != null) {
            orgName = organizationRepository.findById(user.getOrganizationId())
                    .map(Organization::getName)
                    .orElse(null);
        }

        return new UserDto(user.getId(), user.getEmail(), user.getFullName(),
                user.getPhone(), user.getRole(), user.getOrganizationId(), orgName, user.isActive());
    }

    @Transactional
    public StaffMemberDto inviteStaff(Long orgId, InviteStaffRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email " + email + " already exists.");
        }

        Role assignedRole = "HOSPITAL_ADMIN".equalsIgnoreCase(request.getRole())
                ? Role.HOSPITAL_ADMIN
                : Role.HOSPITAL_STAFF;

        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank()
                ? request.getPassword()
                : "Staff@123";

        User staffUser = new User(
                email,
                passwordEncoder.encode(rawPassword),
                request.getFullName().trim(),
                request.getPhone(),
                assignedRole,
                orgId
        );
        staffUser = userRepository.save(staffUser);

        StaffMembership membership = new StaffMembership(
                orgId,
                staffUser.getId(),
                request.getRoleTitle() != null ? request.getRoleTitle() : "Staff Member",
                request.getDepartment() != null ? request.getDepartment() : "General Clinical"
        );
        membership = staffMembershipRepository.save(membership);

        StaffMemberDto dto = new StaffMemberDto();
        dto.setMembershipId(membership.getId());
        dto.setUserId(staffUser.getId());
        dto.setEmail(staffUser.getEmail());
        dto.setFullName(staffUser.getFullName());
        dto.setPhone(staffUser.getPhone());
        dto.setRoleTitle(membership.getRoleTitle());
        dto.setDepartment(membership.getDepartment());
        dto.setActive(membership.isActive());
        dto.setJoinedAt(membership.getJoinedAt());
        return dto;
    }
}
