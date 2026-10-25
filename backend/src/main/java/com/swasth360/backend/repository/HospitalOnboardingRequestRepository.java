package com.swasth360.backend.repository;

import com.swasth360.backend.entity.HospitalOnboardingRequest;
import com.swasth360.backend.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalOnboardingRequestRepository extends JpaRepository<HospitalOnboardingRequest, Long> {
    List<HospitalOnboardingRequest> findByStatus(RequestStatus status);
    List<HospitalOnboardingRequest> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndStatusIn(String email, List<RequestStatus> statuses);
}
