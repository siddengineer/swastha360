package com.swasth360.backend.repository;

import com.swasth360.backend.entity.StaffMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StaffMembershipRepository extends JpaRepository<StaffMembership, Long> {
    List<StaffMembership> findByOrganizationId(Long organizationId);
    Optional<StaffMembership> findByOrganizationIdAndUserId(Long organizationId, Long userId);
    Optional<StaffMembership> findByUserId(Long userId);
}
