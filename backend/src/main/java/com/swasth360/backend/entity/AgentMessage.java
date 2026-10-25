package com.swasth360.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_messages")
public class AgentMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long conversationId;

    @Column(nullable = false)
    private String sender; // "USER" or "AGENT"

    @Column(length = 5000, nullable = false)
    private String content;

    @Column(length = 2000)
    private String safetyNotice;

    @Column(length = 4000)
    private String actionDataJson;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AgentMessage() {}

    public AgentMessage(Long conversationId, String sender, String content, String safetyNotice, String actionDataJson) {
        this.conversationId = conversationId;
        this.sender = sender;
        this.content = content;
        this.safetyNotice = safetyNotice;
        this.actionDataJson = actionDataJson;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSafetyNotice() { return safetyNotice; }
    public void setSafetyNotice(String safetyNotice) { this.safetyNotice = safetyNotice; }

    public String getActionDataJson() { return actionDataJson; }
    public void setActionDataJson(String actionDataJson) { this.actionDataJson = actionDataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
