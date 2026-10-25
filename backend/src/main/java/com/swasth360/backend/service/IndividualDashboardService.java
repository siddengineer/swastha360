package com.swasth360.backend.service;

import com.swasth360.backend.dto.AgentDtos.AgentDto;
import com.swasth360.backend.dto.IndividualDtos.*;
import com.swasth360.backend.entity.Agent;
import com.swasth360.backend.entity.AgentConversation;
import com.swasth360.backend.entity.User;
import com.swasth360.backend.repository.AgentConversationRepository;
import com.swasth360.backend.repository.AgentMessageRepository;
import com.swasth360.backend.repository.AgentRepository;
import com.swasth360.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IndividualDashboardService {

    private final UserRepository userRepository;
    private final AgentRepository agentRepository;
    private final AgentConversationRepository conversationRepository;
    private final AgentMessageRepository messageRepository;

    public IndividualDashboardService(UserRepository userRepository,
                                      AgentRepository agentRepository,
                                      AgentConversationRepository conversationRepository,
                                      AgentMessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional(readOnly = true)
    public IndividualDashboardDto getDashboardData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User #" + userId + " not found"));

        List<AgentDto> availableAgents = agentRepository.findByIsIndividualAgentTrue().stream()
                .map(a -> new AgentDto(a.getId(), a.getName(), a.getDescription(), a.getCategory(),
                        a.getIntendedUsers(), a.isHospitalAgent(), a.isIndividualAgent(),
                        a.getDefaultAvailability(), a.getIconName(), true))
                .collect(Collectors.toList());

        List<SavedConversationSummaryDto> conversations = getSavedConversations(userId);

        IndividualDashboardDto dto = new IndividualDashboardDto();
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setAvailableAgents(availableAgents);
        dto.setRecentConversations(conversations);
        dto.setTotalSavedInteractions(conversations.size());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<SavedConversationSummaryDto> getSavedConversations(Long userId) {
        Map<String, String> agentNameMap = agentRepository.findAll().stream()
                .collect(Collectors.toMap(Agent::getId, Agent::getName, (existing, replacement) -> existing));

        return conversationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(c -> {
                    SavedConversationSummaryDto dto = new SavedConversationSummaryDto();
                    dto.setId(c.getId());
                    dto.setAgentId(c.getAgentId());
                    dto.setAgentName(agentNameMap.getOrDefault(c.getAgentId(), c.getAgentId()));
                    dto.setTitle(c.getTitle());
                    dto.setCreatedAt(c.getCreatedAt());
                    int msgCount = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId()).size();
                    dto.setMessageCount(msgCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
