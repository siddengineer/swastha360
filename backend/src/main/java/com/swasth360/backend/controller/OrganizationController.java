package com.swasth360.backend.controller;

import com.swasth360.backend.dto.OnboardingDtos.CreateOrgFromRequest;
import com.swasth360.backend.dto.OrganizationDtos.*;
import com.swasth360.backend.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/organizations")
@PreAuthorize("hasRole('SWASTH360_ADMIN')")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping
    public ResponseEntity<OrgDetailDto> createOrganization(@Valid @RequestBody CreateOrgFromRequest request) {
        OrgDetailDto response = organizationService.createOrganization(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrganizationSummaryDto>> getAllOrganizations() {
        return ResponseEntity.ok(organizationService.getAllOrganizations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrgDetailDto> getOrganizationById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getOrganizationById(id));
    }

    @PatchMapping("/{id}/agents")
    public ResponseEntity<OrgDetailDto> updateOrgAgents(
            @PathVariable Long id,
            @RequestBody UpdateOrgAgentsRequest request) {
        return ResponseEntity.ok(organizationService.updateOrgAgents(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrgDetailDto> updateOrgStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrgStatusRequest request) {
        return ResponseEntity.ok(organizationService.updateOrgStatus(id, request));
    }
}
