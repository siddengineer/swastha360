package com.swasth360.backend.controller;

import com.swasth360.backend.dto.HospitalDtos.*;
import com.swasth360.backend.entity.Role;
import com.swasth360.backend.entity.User;
import com.swasth360.backend.repository.UserRepository;
import com.swasth360.backend.service.AuthService;
import com.swasth360.backend.service.HospitalDashboardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
@PreAuthorize("hasAnyRole('HOSPITAL_ADMIN', 'HOSPITAL_STAFF')")
public class HospitalDashboardController {

    private final HospitalDashboardService dashboardService;
    private final UserRepository userRepository;
    private final AuthService authService;

    public HospitalDashboardController(HospitalDashboardService dashboardService,
                                       UserRepository userRepository,
                                       AuthService authService) {
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    private User getAuthenticatedHospitalUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));

        if (user.getOrganizationId() == null) {
            throw new AccessDeniedException("User does not belong to a hospital organization");
        }
        return user;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<HospitalDashboardDto> getDashboard(Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        return ResponseEntity.ok(dashboardService.getDashboardData(user.getOrganizationId()));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments(Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        return ResponseEntity.ok(dashboardService.getAppointments(user.getOrganizationId()));
    }

    @GetMapping("/follow-ups")
    public ResponseEntity<List<FollowUpDto>> getFollowUps(Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        return ResponseEntity.ok(dashboardService.getFollowUps(user.getOrganizationId()));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<StaffMemberDto>> getStaff(Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        return ResponseEntity.ok(dashboardService.getStaff(user.getOrganizationId()));
    }

    @PostMapping("/staff")
    @PreAuthorize("hasRole('HOSPITAL_ADMIN')")
    public ResponseEntity<StaffMemberDto> inviteStaff(
            @Valid @RequestBody InviteStaffRequest request,
            Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        StaffMemberDto created = authService.inviteStaff(user.getOrganizationId(), request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/helpdesk-settings")
    public ResponseEntity<HelpdeskSettingsDto> getHelpdeskSettings(Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        return ResponseEntity.ok(dashboardService.getHelpdeskSettings(user.getOrganizationId()));
    }

    @PutMapping("/helpdesk-settings")
    @PreAuthorize("hasRole('HOSPITAL_ADMIN')")
    public ResponseEntity<HelpdeskSettingsDto> updateHelpdeskSettings(
            @RequestBody HelpdeskSettingsDto request,
            Authentication authentication) {
        User user = getAuthenticatedHospitalUser(authentication);
        return ResponseEntity.ok(dashboardService.updateHelpdeskSettings(user.getOrganizationId(), request));
    }
}
