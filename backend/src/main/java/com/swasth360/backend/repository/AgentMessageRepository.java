package com.swasth360.backend.repository;

import com.swasth360.backend.entity.AgentMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentMessageRepository extends JpaRepository<AgentMessage, Long> {
    List<AgentMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}
