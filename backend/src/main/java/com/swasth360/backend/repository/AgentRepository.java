package com.swasth360.backend.repository;

import com.swasth360.backend.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentRepository extends JpaRepository<Agent, String> {
    List<Agent> findByIsIndividualAgentTrue();
    List<Agent> findByIsHospitalAgentTrue();
}
