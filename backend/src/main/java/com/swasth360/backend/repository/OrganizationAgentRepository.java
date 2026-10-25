package com.swasth360.backend.repository;

import com.swasth360.backend.entity.OrganizationAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrganizationAgentRepository extends JpaRepository<OrganizationAgent, Long> {
    List<OrganizationAgent> findByOrganizationId(Long organizationId);
    Optional<OrganizationAgent> findByOrganizationIdAndAgentId(Long organizationId, String agentId);
    void deleteByOrganizationIdAndAgentId(Long organizationId, String agentId);
}
