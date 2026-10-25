package com.swasth360.backend.repository;

import com.swasth360.backend.entity.AgentConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentConversationRepository extends JpaRepository<AgentConversation, Long> {
    List<AgentConversation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AgentConversation> findByUserIdAndAgentIdOrderByCreatedAtDesc(Long userId, String agentId);
    List<AgentConversation> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
}
