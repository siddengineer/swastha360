package com.swasth360.backend.service;

import com.swasth360.backend.dto.AgentDtos.AgentDto;
import com.swasth360.backend.entity.Agent;
import com.swasth360.backend.entity.OrganizationAgent;
import com.swasth360.backend.entity.Role;
import com.swasth360.backend.entity.User;
import com.swasth360.backend.repository.AgentRepository;
import com.swasth360.backend.repository.OrganizationAgentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AgentService {

    private final AgentRepository agentRepository;
    private final OrganizationAgentRepository organizationAgentRepository;

    public AgentService(AgentRepository agentRepository,
                        OrganizationAgentRepository organizationAgentRepository) {
        this.agentRepository = agentRepository;
        this.organizationAgentRepository = organizationAgentRepository;
    }

    @Transactional(readOnly = true)
    public List<AgentDto> getAllAgents() {
        return agentRepository.findAll().stream()
                .map(a -> mapToDto(a, true))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AgentDto> getAgentsForUser(User user) {
        List<Agent> all = agentRepository.findAll();

        if (user.getRole() == Role.SWASTH360_ADMIN) {
            return all.stream().map(a -> mapToDto(a, true)).collect(Collectors.toList());
        }

        if (user.getRole() == Role.HOSPITAL_ADMIN || user.getRole() == Role.HOSPITAL_STAFF) {
            if (user.getOrganizationId() == null) {
                return List.of();
            }
            Set<String> enabledIds = organizationAgentRepository.findByOrganizationId(user.getOrganizationId()).stream()
                    .filter(OrganizationAgent::isEnabled)
                    .map(OrganizationAgent::getAgentId)
                    .collect(Collectors.toSet());

            return all.stream()
                    .filter(a -> enabledIds.contains(a.getId()))
                    .map(a -> mapToDto(a, true))
                    .collect(Collectors.toList());
        }

        if (user.getRole() == Role.INDIVIDUAL_USER) {
            return all.stream()
                    .filter(Agent::isIndividualAgent)
                    .map(a -> mapToDto(a, true))
                    .collect(Collectors.toList());
        }

        return List.of();
    }

    @Transactional(readOnly = true)
    public boolean isAgentEnabledForOrg(Long orgId, String agentId) {
        if (orgId == null || agentId == null) return false;
        return organizationAgentRepository.findByOrganizationIdAndAgentId(orgId, agentId)
                .map(OrganizationAgent::isEnabled)
                .orElse(false);
    }

    private AgentDto mapToDto(Agent a, boolean isEnabledForTenant) {
        return new AgentDto(
                a.getId(),
                a.getName(),
                a.getDescription(),
                a.getCategory(),
                a.getIntendedUsers(),
                a.isHospitalAgent(),
                a.isIndividualAgent(),
                a.getDefaultAvailability(),
                a.getIconName(),
                isEnabledForTenant
        );
    }
}
