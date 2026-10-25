package com.swasth360.backend.service;

import com.swasth360.backend.dto.OnboardingDtos.*;
import com.swasth360.backend.entity.HospitalOnboardingRequest;
import com.swasth360.backend.entity.RequestStatus;
import com.swasth360.backend.repository.HospitalOnboardingRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalOnboardingService {

    private final HospitalOnboardingRequestRepository onboardingRequestRepository;

    public HospitalOnboardingService(HospitalOnboardingRequestRepository onboardingRequestRepository) {
        this.onboardingRequestRepository = onboardingRequestRepository;
    }

    @Transactional
    public OnboardingResponseDto submitRequest(OnboardingSubmitRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // Prevent accidental duplicate pending / under-review submissions
        boolean hasActiveRequest = onboardingRequestRepository.existsByEmailIgnoreCaseAndStatusIn(
                email, Arrays.asList(RequestStatus.PENDING_REVIEW, RequestStatus.UNDER_REVIEW));

        if (hasActiveRequest) {
            throw new IllegalStateException("An onboarding request from this email address is already under review.");
        }

        HospitalOnboardingRequest entity = new HospitalOnboardingRequest();
        entity.setHospitalName(request.getHospitalName().trim());
        entity.setOrgType(request.getOrgType());
        entity.setContactPerson(request.getContactPerson().trim());
        entity.setEmail(email);
        entity.setPhone(request.getPhone().trim());
        entity.setCity(request.getCity());
        entity.setState(request.getState());
        entity.setBranchesCount(request.getBranchesCount() != null ? request.getBranchesCount() : 1);
        entity.setStaffCount(request.getStaffCount() != null ? request.getStaffCount() : 20);

        if (request.getRequestedAgents() != null && !request.getRequestedAgents().isEmpty()) {
            entity.setRequestedAgents(String.join(",", request.getRequestedAgents()));
        } else {
            entity.setRequestedAgents("patient-followup,appointment-management");
        }

        entity.setIntendedUseCases(request.getIntendedUseCases());
        entity.setExistingSoftware(request.getExistingSoftware());
        entity.setAdditionalNotes(request.getAdditionalNotes());
        entity.setConsentToContact(request.isConsentToContact());
        entity.setStatus(RequestStatus.PENDING_REVIEW);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        entity = onboardingRequestRepository.save(entity);
        return mapToDto(entity);
    }

    @Transactional(readOnly = true)
    public List<OnboardingResponseDto> getAllRequests() {
        return onboardingRequestRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OnboardingResponseDto getRequestById(Long id) {
        HospitalOnboardingRequest entity = onboardingRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Onboarding request #" + id + " not found"));
        return mapToDto(entity);
    }

    @Transactional
    public OnboardingResponseDto updateStatus(Long id, StatusUpdateRequest request) {
        HospitalOnboardingRequest entity = onboardingRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Onboarding request #" + id + " not found"));

        entity.setStatus(request.getStatus());
        if (request.getStatus() == RequestStatus.REJECTED) {
            entity.setRejectionReason(request.getRejectionReason() != null ? request.getRejectionReason() : "Requirements do not meet current onboarding criteria.");
        } else {
            entity.setRejectionReason(null);
        }
        entity.setUpdatedAt(LocalDateTime.now());

        entity = onboardingRequestRepository.save(entity);
        return mapToDto(entity);
    }

    private OnboardingResponseDto mapToDto(HospitalOnboardingRequest entity) {
        OnboardingResponseDto dto = new OnboardingResponseDto();
        dto.setRequestId(entity.getId());
        dto.setHospitalName(entity.getHospitalName());
        dto.setOrgType(entity.getOrgType());
        dto.setContactPerson(entity.getContactPerson());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setBranchesCount(entity.getBranchesCount());
        dto.setStaffCount(entity.getStaffCount());

        if (entity.getRequestedAgents() != null && !entity.getRequestedAgents().isBlank()) {
            dto.setRequestedAgents(Arrays.asList(entity.getRequestedAgents().split(",")));
        } else {
            dto.setRequestedAgents(Collections.emptyList());
        }

        dto.setIntendedUseCases(entity.getIntendedUseCases());
        dto.setExistingSoftware(entity.getExistingSoftware());
        dto.setAdditionalNotes(entity.getAdditionalNotes());
        dto.setStatus(entity.getStatus());
        dto.setRejectionReason(entity.getRejectionReason());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
