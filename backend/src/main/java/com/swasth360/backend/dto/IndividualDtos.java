package com.swasth360.backend.dto;

import com.swasth360.backend.dto.AgentDtos.AgentDto;
import java.time.LocalDateTime;
import java.util.List;

public class IndividualDtos {

    public static class IndividualDashboardDto {
        private Long userId;
        private String fullName;
        private String email;
        private List<AgentDto> availableAgents;
        private List<SavedConversationSummaryDto> recentConversations;
        private int totalSavedInteractions;

        public IndividualDashboardDto() {}

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public List<AgentDto> getAvailableAgents() { return availableAgents; }
        public void setAvailableAgents(List<AgentDto> availableAgents) { this.availableAgents = availableAgents; }
        public List<SavedConversationSummaryDto> getRecentConversations() { return recentConversations; }
        public void setRecentConversations(List<SavedConversationSummaryDto> recentConversations) { this.recentConversations = recentConversations; }
        public int getTotalSavedInteractions() { return totalSavedInteractions; }
        public void setTotalSavedInteractions(int totalSavedInteractions) { this.totalSavedInteractions = totalSavedInteractions; }
    }

    public static class SavedConversationSummaryDto {
        private Long id;
        private String agentId;
        private String agentName;
        private String title;
        private LocalDateTime createdAt;
        private int messageCount;

        public SavedConversationSummaryDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getAgentId() { return agentId; }
        public void setAgentId(String agentId) { this.agentId = agentId; }
        public String getAgentName() { return agentName; }
        public void setAgentName(String agentName) { this.agentName = agentName; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public int getMessageCount() { return messageCount; }
        public void setMessageCount(int messageCount) { this.messageCount = messageCount; }
    }
}
