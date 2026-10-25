package com.swasth360.backend.controller;

import com.swasth360.backend.dto.AgentDtos.*;
import com.swasth360.backend.entity.User;
import com.swasth360.backend.repository.UserRepository;
import com.swasth360.backend.service.AIOrchestrationService;
import com.swasth360.backend.service.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;
    private final AIOrchestrationService aiOrchestrationService;
    private final UserRepository userRepository;

    public AgentController(AgentService agentService,
                           AIOrchestrationService aiOrchestrationService,
                           UserRepository userRepository) {
        this.agentService = agentService;
        this.aiOrchestrationService = aiOrchestrationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AgentDto>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AgentDto>> getMyAgents(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(agentService.getAgentsForUser(user));
    }

    @PostMapping("/{agentId}/chat")
    public ResponseEntity<AgentChatResponseDto> chat(
            @PathVariable String agentId,
            @RequestBody AgentChatRequestDto request,
            Authentication authentication) {
        User user = null;
        if (authentication != null && authentication.isAuthenticated()) {
            user = userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        AgentChatResponseDto response = aiOrchestrationService.chat(agentId, request, user);
        return ResponseEntity.ok(response);
    }
}
