package com.swasth360.backend.data;

import com.swasth360.backend.entity.*;
import com.swasth360.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AgentRepository agentRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationAgentRepository organizationAgentRepository;
    private final UserRepository userRepository;
    private final StaffMembershipRepository staffMembershipRepository;
    private final HospitalOnboardingRequestRepository onboardingRequestRepository;
    private final AppointmentRepository appointmentRepository;
    private final FollowUpRepository followUpRepository;
    private final HelpdeskEntryRepository helpdeskEntryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AgentRepository agentRepository,
                           OrganizationRepository organizationRepository,
                           OrganizationAgentRepository organizationAgentRepository,
                           UserRepository userRepository,
                           StaffMembershipRepository staffMembershipRepository,
                           HospitalOnboardingRequestRepository onboardingRequestRepository,
                           AppointmentRepository appointmentRepository,
                           FollowUpRepository followUpRepository,
                           HelpdeskEntryRepository helpdeskEntryRepository,
                           PasswordEncoder passwordEncoder) {
        this.agentRepository = agentRepository;
        this.organizationRepository = organizationRepository;
        this.organizationAgentRepository = organizationAgentRepository;
        this.userRepository = userRepository;
        this.staffMembershipRepository = staffMembershipRepository;
        this.onboardingRequestRepository = onboardingRequestRepository;
        this.appointmentRepository = appointmentRepository;
        this.followUpRepository = followUpRepository;
        this.helpdeskEntryRepository = helpdeskEntryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (agentRepository.count() > 0) {
            log.info("Database already initialized with seed data.");
            return;
        }

        log.info("Initializing Swasth360 seed data...");

        // 1. Seed the 9 AI Agents
        List<Agent> agents = List.of(
                new Agent("patient-followup", "Patient Follow-up Agent",
                        "Helps authorized healthcare staff organize follow-up schedules and prepare patient follow-up reminders.",
                        "Hospital Workflow", "Hospital Staff & Administrators", true, false, "Available for Hospital", "CalendarCheck"),
                new Agent("medication-guidance", "Medication Guidance Agent",
                        "Explains general medication information and helps users understand clinician-provided medication instructions using approved information.",
                        "Patient Education", "Individual Users & Hospital Patients", true, true, "Available for Individuals", "Pill"),
                new Agent("appointment-management", "Appointment Management Agent",
                        "Helps users understand appointments and assists authorized staff with appointment management.",
                        "Hospital Workflow", "Hospitals & Individuals", true, true, "Available for Hospital", "Calendar"),
                new Agent("chronic-care", "Chronic Care Agent",
                        "Supports routine care tracking and educational information for people living with chronic conditions.",
                        "Patient Self-Care", "Individual Users", true, true, "Available for Individuals", "Activity"),
                new Agent("maternal-child", "Maternal & Child Care Agent",
                        "Provides general, reviewed maternal and child health information and identifies warning signs.",
                        "Maternal Health", "Mothers, Families & Health Workers", true, true, "Available for Individuals", "HeartHandshake"),
                new Agent("insurance-ayushman", "Insurance & Ayushman Bharat Agent",
                        "Helps users understand insurance documents, common eligibility requirements, and administrative processes.",
                        "Healthcare Navigation", "Hospital Desk Staff & Citizens", true, true, "Available for Individuals", "ShieldCheck"),
                new Agent("hospital-helpdesk", "Hospital Helpdesk Agent",
                        "Answers common hospital-related questions using fictional, hospital-approved information customized by hospital admins.",
                        "Hospital Frontdesk", "Patients, Visitors & Hospital Staff", true, false, "Available for Hospital", "HelpCircle"),
                new Agent("mental-wellness", "Mental Wellness Check-in Agent",
                        "Offers supportive wellness check-ins, reflection prompts, and general wellbeing resources. Never diagnoses; includes crisis escalation.",
                        "Wellness & Support", "Individual Users", false, true, "Available for Individuals", "Smile"),
                new Agent("multilingual-healthcare", "Multilingual Healthcare Agent",
                        "Helps users understand healthcare information in supported Indian languages (English, Hindi, Marathi).",
                        "Language Accessibility", "Hospitals & Individuals", true, true, "Available in Demo", "Languages")
        );
        agentRepository.saveAll(agents);

        // 2. Seed Demo Organizations
        Organization abcHospital = new Organization(
                "abc-healthcare-demo",
                "ABC Healthcare Demo Hospital",
                "Multispecialty Hospital",
                "New Delhi",
                "Delhi",
                OrgStatus.ACTIVE,
                "Dr. Ramesh Gupta",
                "hospitaladmin@abchealthcare.demo",
                "+91 11-4567-8900",
                3,
                65
        );
        abcHospital = organizationRepository.save(abcHospital);

        Organization sunriseClinic = new Organization(
                "sunrise-clinic-demo",
                "Sunrise Clinic Demo",
                "Primary Care Clinic",
                "Mumbai",
                "Maharashtra",
                OrgStatus.ACTIVE,
                "Dr. Neha Kulkarni",
                "admin@sunriseclinic.demo",
                "+91 22-2876-5432",
                1,
                12
        );
        sunriseClinic = organizationRepository.save(sunriseClinic);

        // 3. Assign Enabled Agents to Organizations
        // ABC Healthcare: Patient Follow-up, Appointment Management, Hospital Helpdesk
        organizationAgentRepository.save(new OrganizationAgent(abcHospital.getId(), "patient-followup", true));
        organizationAgentRepository.save(new OrganizationAgent(abcHospital.getId(), "appointment-management", true));
        organizationAgentRepository.save(new OrganizationAgent(abcHospital.getId(), "hospital-helpdesk", true));

        // Sunrise Clinic: Appointment Management, Multilingual Healthcare
        organizationAgentRepository.save(new OrganizationAgent(sunriseClinic.getId(), "appointment-management", true));
        organizationAgentRepository.save(new OrganizationAgent(sunriseClinic.getId(), "multilingual-healthcare", true));

        // 4. Seed Helpdesk Entries
        helpdeskEntryRepository.save(new HelpdeskEntry(
                abcHospital.getId(),
                "General Wards: 5:00 PM – 7:00 PM Daily | ICU: 11:00 AM – 12:00 PM (Strictly 1 visitor)",
                "Please report 20 minutes prior to your slot at OPD Counter 2 with Government Photo ID (Aadhaar / ABHA).",
                "+91 11-4567-8900 (Emergency Casualty: +91 11-4567-8999)",
                "helpdesk@abchealthcare.demo",
                "Q: Where is the pharmacy located? A: Ground floor near Gate 1, open 24x7.\nQ: Is Ayushman Bharat PM-JAY accepted? A: Yes, visit the Ayushman Mitra counter on Ground Floor Block B."
        ));

        // 5. Seed Users
        // Swasth360 Admin
        User swasthAdmin = new User(
                "admin@swasth360.in",
                passwordEncoder.encode("Admin@123"),
                "Swasth360 Platform Administrator",
                "+91 98111-00360",
                Role.SWASTH360_ADMIN,
                null
        );
        userRepository.save(swasthAdmin);

        // Hospital Admin (ABC Healthcare)
        User hospitalAdmin = new User(
                "hospitaladmin@abchealthcare.demo",
                passwordEncoder.encode("Hospital@123"),
                "Dr. Ramesh Gupta (Hospital Admin)",
                "+91 98222-11444",
                Role.HOSPITAL_ADMIN,
                abcHospital.getId()
        );
        hospitalAdmin = userRepository.save(hospitalAdmin);
        staffMembershipRepository.save(new StaffMembership(abcHospital.getId(), hospitalAdmin.getId(), "Medical Superintendent", "Administration"));

        // Hospital Staff (ABC Healthcare)
        User hospitalStaff = new User(
                "staff@abchealthcare.demo",
                passwordEncoder.encode("Staff@123"),
                "Sister Sunita Sharma (Staff Nurse)",
                "+91 98333-22555",
                Role.HOSPITAL_STAFF,
                abcHospital.getId()
        );
        hospitalStaff = userRepository.save(hospitalStaff);
        staffMembershipRepository.save(new StaffMembership(abcHospital.getId(), hospitalStaff.getId(), "Senior Staff Nurse", "OPD & Day Care"));

        // Hospital Admin (Sunrise Clinic)
        User sunriseAdmin = new User(
                "admin@sunriseclinic.demo",
                passwordEncoder.encode("Sunrise@123"),
                "Dr. Neha Kulkarni (Clinic Head)",
                "+91 98444-33666",
                Role.HOSPITAL_ADMIN,
                sunriseClinic.getId()
        );
        sunriseAdmin = userRepository.save(sunriseAdmin);
        staffMembershipRepository.save(new StaffMembership(sunriseClinic.getId(), sunriseAdmin.getId(), "Clinic Director", "Family Medicine"));

        // Individual B2C User
        User individualUser = new User(
                "rahul.sharma@example.com",
                passwordEncoder.encode("User@123"),
                "Rahul Sharma (Individual User)",
                "+91 98555-44777",
                Role.INDIVIDUAL_USER,
                null // Completely independent of any hospital
        );
        userRepository.save(individualUser);

        // 6. Seed Sample Onboarding Requests
        HospitalOnboardingRequest pendingReq = new HospitalOnboardingRequest();
        pendingReq.setHospitalName("Metro City Super Specialty Hospital");
        pendingReq.setOrgType("Super Specialty Hospital");
        pendingReq.setContactPerson("Dr. Priya Nair");
        pendingReq.setEmail("priya.nair@metrocity.demo");
        pendingReq.setPhone("+91 98765-43210");
        pendingReq.setCity("Bengaluru");
        pendingReq.setState("Karnataka");
        pendingReq.setBranchesCount(2);
        pendingReq.setStaffCount(120);
        pendingReq.setRequestedAgents("patient-followup,appointment-management,hospital-helpdesk,insurance-ayushman");
        pendingReq.setIntendedUseCases("Automate post-surgical discharge follow-up schedules and patient inquiry front-desk queues.");
        pendingReq.setExistingSoftware("MedPlus HIS v4.2");
        pendingReq.setAdditionalNotes("Looking for pilot rollout in cardiology and general surgery wards.");
        pendingReq.setStatus(RequestStatus.PENDING_REVIEW);
        onboardingRequestRepository.save(pendingReq);

        HospitalOnboardingRequest approvedReq = new HospitalOnboardingRequest();
        approvedReq.setHospitalName("CareWell Clinic Pune");
        approvedReq.setOrgType("Polyclinic");
        approvedReq.setContactPerson("Dr. Anand Deshmukh");
        approvedReq.setEmail("anand@carewellpune.demo");
        approvedReq.setPhone("+91 98989-12121");
        approvedReq.setCity("Pune");
        approvedReq.setState("Maharashtra");
        approvedReq.setBranchesCount(1);
        approvedReq.setStaffCount(18);
        approvedReq.setRequestedAgents("appointment-management,multilingual-healthcare");
        approvedReq.setIntendedUseCases("Multilingual OPD reminders in Marathi and English for local community patients.");
        approvedReq.setStatus(RequestStatus.APPROVED);
        onboardingRequestRepository.save(approvedReq);

        // 7. Seed Sample Appointments for ABC Healthcare Demo
        appointmentRepository.saveAll(List.of(
                new Appointment(abcHospital.getId(), "APT-9041", "P. Verma (Ref #PT-8421)", "Cardiology OPD", "Dr. Anita Rao",
                        LocalDate.now().plusDays(1), "10:30 AM", "CONFIRMED", "Post-angioplasty routine checkup"),
                new Appointment(abcHospital.getId(), "APT-9042", "S. Mehra (Ref #PT-7712)", "Orthopedics", "Dr. R. Iyer",
                        LocalDate.now().plusDays(1), "11:15 AM", "SCHEDULED", "Right knee arthroscopy follow-up"),
                new Appointment(abcHospital.getId(), "APT-9043", "K. Banerjee (Ref #PT-9033)", "General Medicine", "Dr. S. Nambiar",
                        LocalDate.now().plusDays(2), "02:00 PM", "SCHEDULED", "Type 2 diabetes quarterly review")
        ));

        // 8. Seed Sample Follow-ups for ABC Healthcare Demo
        followUpRepository.saveAll(List.of(
                new FollowUp(abcHospital.getId(), "A. Kumar (#PT-8421)", "Laparoscopic Cholecystectomy Post-Op (48h)",
                        LocalDate.now(), "Sister Sunita Sharma", "PENDING", "Check pain score, dressing dry, oral fluids"),
                new FollowUp(abcHospital.getId(), "V. Joshi (#PT-9032)", "Day-7 Hypertension Medication Titration",
                        LocalDate.now().plusDays(1), "Sister Sunita Sharma", "PENDING", "Log morning/evening BP readings"),
                new FollowUp(abcHospital.getId(), "R. Sethi (#PT-6520)", "Cataract Surgery Day-3 Post-Op Review",
                        LocalDate.now().minusDays(1), "Sister Sunita Sharma", "COMPLETED", "Patient reports clear vision; eye drops confirmed")
        ));

        log.info("Swasth360 seed data initialized successfully!");
    }
}
