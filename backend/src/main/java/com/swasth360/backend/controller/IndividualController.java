package com.swasth360.backend.controller;

import com.swasth360.backend.dto.IndividualDtos.*;
import com.swasth360.backend.entity.User;
import com.swasth360.backend.repository.UserRepository;
import com.swasth360.backend.service.IndividualDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/individual")
@PreAuthorize("hasRole('INDIVIDUAL_USER')")
public class IndividualController {

    private final IndividualDashboardService individualDashboardService;
    private final UserRepository userRepository;

    public IndividualController(IndividualDashboardService individualDashboardService,
                                UserRepository userRepository) {
        this.individualDashboardService = individualDashboardService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedIndividualUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<IndividualDashboardDto> getDashboard(Authentication authentication) {
        User user = getAuthenticatedIndividualUser(authentication);
        return ResponseEntity.ok(individualDashboardService.getDashboardData(user.getId()));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<SavedConversationSummaryDto>> getConversations(Authentication authentication) {
        User user = getAuthenticatedIndividualUser(authentication);
        return ResponseEntity.ok(individualDashboardService.getSavedConversations(user.getId()));
    }
}
