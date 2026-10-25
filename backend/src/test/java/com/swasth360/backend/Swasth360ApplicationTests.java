package com.swasth360.backend;

import com.swasth360.backend.dto.AuthDtos.LoginRequest;
import com.swasth360.backend.dto.AuthDtos.RegisterRequest;
import com.swasth360.backend.dto.OnboardingDtos.OnboardingSubmitRequest;
import com.swasth360.backend.dto.OnboardingDtos.StatusUpdateRequest;
import com.swasth360.backend.entity.RequestStatus;
import com.swasth360.backend.service.AuthService;
import com.swasth360.backend.service.HospitalOnboardingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class Swasth360ApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private HospitalOnboardingService onboardingService;

    @Test
    void contextLoads() {
        assertNotNull(authService);
        assertNotNull(onboardingService);
    }

    @Test
    void testHospitalAdminLogin() {
        LoginRequest req = new LoginRequest("hospitaladmin@abchealthcare.demo", "Hospital@123");
        var res = authService.login(req);
        assertNotNull(res.getToken());
        assertEquals("hospitaladmin@abchealthcare.demo", res.getEmail());
        assertNotNull(res.getOrganizationId());
    }

    @Test
    void testIndividualUserRegistrationAndLogin() {
        String testEmail = "test.user." + System.currentTimeMillis() + "@swasth360.test";
        RegisterRequest regReq = new RegisterRequest();
        regReq.setFullName("Test User");
        regReq.setEmail(testEmail);
        regReq.setPassword("Secret@123");
        regReq.setTermsAccepted(true);

        var regRes = authService.registerIndividual(regReq);
        assertNotNull(regRes.getToken());
        assertNull(regRes.getOrganizationId(), "Individual user must not be assigned to any hospital");

        // Verify login
        LoginRequest loginReq = new LoginRequest(testEmail, "Secret@123");
        var loginRes = authService.login(loginReq);
        assertNotNull(loginRes.getToken());
        assertNull(loginRes.getOrganizationId());
    }

    @Test
    void testHospitalOnboardingRequestWorkflow() {
        String testHospitalEmail = "admin." + System.currentTimeMillis() + "@cityhealth.test";
        OnboardingSubmitRequest submitReq = new OnboardingSubmitRequest();
        submitReq.setHospitalName("City Health Center");
        submitReq.setOrgType("Clinic");
        submitReq.setContactPerson("Dr. Sharma");
        submitReq.setEmail(testHospitalEmail);
        submitReq.setPhone("+91 9988776655");
        submitReq.setCity("Indore");
        submitReq.setState("Madhya Pradesh");
        submitReq.setRequestedAgents(List.of("patient-followup", "appointment-management"));
        submitReq.setConsentToContact(true);

        var created = onboardingService.submitRequest(submitReq);
        assertNotNull(created.getRequestId());
        assertEquals(RequestStatus.PENDING_REVIEW, created.getStatus());

        // Update status to UNDER_REVIEW
        var updated = onboardingService.updateStatus(created.getRequestId(),
                new StatusUpdateRequest(RequestStatus.UNDER_REVIEW, null));
        assertEquals(RequestStatus.UNDER_REVIEW, updated.getStatus());

        // Update status to APPROVED
        var approved = onboardingService.updateStatus(created.getRequestId(),
                new StatusUpdateRequest(RequestStatus.APPROVED, null));
        assertEquals(RequestStatus.APPROVED, approved.getStatus());
    }
}
