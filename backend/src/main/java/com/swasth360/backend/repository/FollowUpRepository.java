package com.swasth360.backend.repository;

import com.swasth360.backend.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByOrganizationIdOrderByFollowUpDateAsc(Long organizationId);
}
