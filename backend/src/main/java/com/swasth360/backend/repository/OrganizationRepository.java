package com.swasth360.backend.repository;

import com.swasth360.backend.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByUniqueSlug(String uniqueSlug);
    boolean existsByUniqueSlug(String uniqueSlug);
}
