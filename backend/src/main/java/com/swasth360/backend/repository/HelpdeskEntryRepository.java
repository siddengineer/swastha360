package com.swasth360.backend.repository;

import com.swasth360.backend.entity.HelpdeskEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HelpdeskEntryRepository extends JpaRepository<HelpdeskEntry, Long> {
    Optional<HelpdeskEntry> findByOrganizationId(Long organizationId);
}
