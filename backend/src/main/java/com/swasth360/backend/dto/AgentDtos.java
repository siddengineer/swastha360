package com.swasth360.backend.dto;

import java.util.List;
import java.util.Map;

public class AgentDtos {

    public static class AgentDto {
        private String id;
        private String name;
        private String description;
        private String category;
        private String intendedUsers;
        private boolean isHospitalAgent;
        private boolean isIndividualAgent;
        private String defaultAvailability;
        private String iconName;
        private boolean enabledForTenant = true;

        public AgentDto() {}

        public AgentDto(String id, String name, String description, String category, String intendedUsers,
                        boolean isHospitalAgent, boolean isIndividualAgent, String defaultAvailability,
                        String iconName, boolean enabledForTenant) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.category = category;
            this.intendedUsers = intendedUsers;
            this.isHospitalAgent = isHospitalAgent;
            this.isIndividualAgent = isIndividualAgent;
            this.defaultAvailability = defaultAvailability;
            this.iconName = iconName;
            this.enabledForTenant = enabledForTenant;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getIntendedUsers() { return intendedUsers; }
        public void setIntendedUsers(String intendedUsers) { this.intendedUsers = intendedUsers; }
        public boolean isHospitalAgent() { return isHospitalAgent; }
        public void setHospitalAgent(boolean hospitalAgent) { isHospitalAgent = hospitalAgent; }
        public boolean isIndividualAgent() { return isIndividualAgent; }
        public void setIndividualAgent(boolean individualAgent) { isIndividualAgent = individualAgent; }
        public String getDefaultAvailability() { return defaultAvailability; }
        public void setDefaultAvailability(String defaultAvailability) { this.defaultAvailability = defaultAvailability; }
        public String getIconName() { return iconName; }
        public void setIconName(String iconName) { this.iconName = iconName; }
        public boolean isEnabledForTenant() { return enabledForTenant; }
        public void setEnabledForTenant(boolean enabledForTenant) { this.enabledForTenant = enabledForTenant; }
    }

    public static class AgentChatRequestDto {
        private String message;
        private Long conversationId;
        private String language = "en";

        public AgentChatRequestDto() {}
        public AgentChatRequestDto(String message, Long conversationId, String language) {
            this.message = message;
            this.conversationId = conversationId;
            this.language = language;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
    }

    public static class EscalationDto {
        private boolean isCrisis;
        private String helplineName;
        private String helplineNumber;
        private String recommendedAction;

        public EscalationDto() {}

        public boolean isCrisis() { return isCrisis; }
        public void setCrisis(boolean crisis) { isCrisis = crisis; }
        public String getHelplineName() { return helplineName; }
        public void setHelplineName(String helplineName) { this.helplineName = helplineName; }
        public String getHelplineNumber() { return helplineNumber; }
        public void setHelplineNumber(String helplineNumber) { this.helplineNumber = helplineNumber; }
        public String getRecommendedAction() { return recommendedAction; }
        public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    }

    public static class AgentChatResponseDto {
        private String agentId;
        private String agentName;
        private String reply;
        private List<String> suggestions;
        private Map<String, Object> actionData;
        private String safetyNotice;
        private String modelUsed;
        private EscalationDto escalation;
        private Long conversationId;

        public AgentChatResponseDto() {}

        public String getAgentId() { return agentId; }
        public void setAgentId(String agentId) { this.agentId = agentId; }
        public String getAgentName() { return agentName; }
        public void setAgentName(String agentName) { this.agentName = agentName; }
        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
        public List<String> getSuggestions() { return suggestions; }
        public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
        public Map<String, Object> getActionData() { return actionData; }
        public void setActionData(Map<String, Object> actionData) { this.actionData = actionData; }
        public String getSafetyNotice() { return safetyNotice; }
        public void setSafetyNotice(String safetyNotice) { this.safetyNotice = safetyNotice; }
        public String getModelUsed() { return modelUsed; }
        public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }
        public EscalationDto getEscalation() { return escalation; }
        public void setEscalation(EscalationDto escalation) { this.escalation = escalation; }
        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    }
}
