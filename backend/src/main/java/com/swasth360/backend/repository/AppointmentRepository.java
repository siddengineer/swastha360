package com.swasth360.backend.repository;

import com.swasth360.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByOrganizationIdOrderByAppointmentDateDesc(Long organizationId);
}
