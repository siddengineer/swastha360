package com.swasth360.backend.controller;

import com.swasth360.backend.dto.OnboardingDtos.*;
import com.swasth360.backend.service.HospitalOnboardingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HospitalOnboardingController {

    private final HospitalOnboardingService onboardingService;

    public HospitalOnboardingController(HospitalOnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    // Public endpoint for hospitals to submit onboarding enquiry
    @PostMapping("/hospital-onboarding")
    public ResponseEntity<OnboardingResponseDto> submitRequest(@Valid @RequestBody OnboardingSubmitRequest request) {
        OnboardingResponseDto response = onboardingService.submitRequest(request);
        return ResponseEntity.ok(response);
    }

    // Protected Swasth360 Admin endpoints
    @GetMapping("/admin/hospital-requests")
    @PreAuthorize("hasRole('SWASTH360_ADMIN')")
    public ResponseEntity<List<OnboardingResponseDto>> getAllRequests() {
        return ResponseEntity.ok(onboardingService.getAllRequests());
    }

    @GetMapping("/admin/hospital-requests/{id}")
    @PreAuthorize("hasRole('SWASTH360_ADMIN')")
    public ResponseEntity<OnboardingResponseDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(onboardingService.getRequestById(id));
    }

    @PatchMapping("/admin/hospital-requests/{id}/status")
    @PreAuthorize("hasRole('SWASTH360_ADMIN')")
    public ResponseEntity<OnboardingResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(onboardingService.updateStatus(id, request));
    }
}
