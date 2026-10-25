/**
 * In-Browser Demo Store for Swasth360
 * Enables 100% free static hosting on Render (or Netlify/Vercel/GitHub Pages)
 * with zero paid web services required, while supporting all full-stack workflows.
 */

import type {
  AuthResponse,
  User,
  Agent,
  HospitalOnboardingRequest,
  OrganizationSummary,
  OrganizationDetail,
  HospitalDashboardData,
  Appointment,
  FollowUp,
  StaffMember,
  HelpdeskSettings,
  IndividualDashboardData,
  SavedConversationSummary,
  ChatResponse,
  RequestStatus,
  OrgStatus
} from '../types';

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'patient-followup',
    name: 'Patient Follow-up Agent',
    description: 'Helps authorized healthcare staff organize follow-up schedules and prepare patient follow-up reminders.',
    category: 'Hospital Workflow',
    intendedUsers: 'Hospital Staff & Administrators',
    isHospitalAgent: true,
    isIndividualAgent: false,
    defaultAvailability: 'Available for Hospital',
    iconName: 'CalendarCheck',
    enabledForTenant: true
  },
  {
    id: 'medication-guidance',
    name: 'Medication Guidance Agent',
    description: 'Explains general medication information and helps users understand clinician-provided medication instructions using approved information.',
    category: 'Patient Education',
    intendedUsers: 'Individual Users & Hospital Patients',
    isHospitalAgent: true,
    isIndividualAgent: true,
    defaultAvailability: 'Available for Individuals',
    iconName: 'Pill',
    enabledForTenant: true
  },
  {
    id: 'appointment-management',
    name: 'Appointment Management Agent',
    description: 'Helps users understand appointments and assists authorized staff with appointment management.',
    category: 'Hospital Workflow',
    intendedUsers: 'Hospitals & Individuals',
    isHospitalAgent: true,
    isIndividualAgent: true,
    defaultAvailability: 'Available for Hospital',
    iconName: 'Calendar',
    enabledForTenant: true
  },
  {
    id: 'chronic-care',
    name: 'Chronic Care Agent',
    description: 'Supports routine care tracking and educational information for people living with chronic conditions.',
    category: 'Patient Self-Care',
    intendedUsers: 'Individual Users',
    isHospitalAgent: true,
    isIndividualAgent: true,
    defaultAvailability: 'Available for Individuals',
    iconName: 'Activity',
    enabledForTenant: true
  },
  {
    id: 'maternal-child',
    name: 'Maternal & Child Care Agent',
    description: 'Provides general, reviewed maternal and child health information and identifies warning signs.',
    category: 'Maternal Health',
    intendedUsers: 'Mothers, Families & Health Workers',
    isHospitalAgent: true,
    isIndividualAgent: true,
    defaultAvailability: 'Available for Individuals',
    iconName: 'HeartHandshake',
    enabledForTenant: true
  },
  {
    id: 'insurance-ayushman',
    name: 'Insurance & Ayushman Bharat Agent',
    description: 'Helps users understand insurance documents, common eligibility requirements, and administrative processes.',
    category: 'Healthcare Navigation',
    intendedUsers: 'Hospital Desk Staff & Citizens',
    isHospitalAgent: true,
    isIndividualAgent: true,
    defaultAvailability: 'Available for Individuals',
    iconName: 'ShieldCheck',
    enabledForTenant: true
  },
  {
    id: 'hospital-helpdesk',
    name: 'Hospital Helpdesk Agent',
    description: 'Answers common hospital-related questions using fictional, hospital-approved information customized by hospital admins.',
    category: 'Hospital Frontdesk',
    intendedUsers: 'Patients, Visitors & Hospital Staff',
    isHospitalAgent: true,
    isIndividualAgent: false,
    defaultAvailability: 'Available for Hospital',
    iconName: 'HelpCircle',
    enabledForTenant: true
  },
  {
    id: 'mental-wellness',
    name: 'Mental Wellness Check-in Agent',
    description: 'Offers supportive wellness check-ins, reflection prompts, and general wellbeing resources. Never diagnoses; includes crisis escalation.',
    category: 'Wellness & Support',
    intendedUsers: 'Individual Users',
    isHospitalAgent: false,
    isIndividualAgent: true,
    defaultAvailability: 'Available for Individuals',
    iconName: 'Smile',
    enabledForTenant: true
  },
  {
    id: 'multilingual-healthcare',
    name: 'Multilingual Healthcare Agent',
    description: 'Helps users understand healthcare information in supported Indian languages (English, Hindi, Marathi).',
    category: 'Language Accessibility',
    intendedUsers: 'Hospitals & Individuals',
    isHospitalAgent: true,
    isIndividualAgent: true,
    defaultAvailability: 'Available in Demo',
    iconName: 'Languages',
    enabledForTenant: true
  }
];

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem('swasth360_mock_' + key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem('swasth360_mock_' + key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
}

export const mockStore = {
  getUsers: () => getStored<any[]>('users', [
    {
      id: 1,
      email: 'admin@swasth360.in',
      password: 'Admin@123',
      fullName: 'Swasth360 Platform Administrator',
      role: 'SWASTH360_ADMIN',
      organizationId: null,
      organizationName: null,
      organizationSlug: null,
      active: true
    },
    {
      id: 2,
      email: 'hospitaladmin@abchealthcare.demo',
      password: 'Hospital@123',
      fullName: 'Dr. Ramesh Gupta (Hospital Admin)',
      role: 'HOSPITAL_ADMIN',
      organizationId: 1,
      organizationName: 'ABC Healthcare Demo Hospital',
      organizationSlug: 'abc-healthcare-demo',
      active: true
    },
    {
      id: 3,
      email: 'staff@abchealthcare.demo',
      password: 'Staff@123',
      fullName: 'Sister Sunita Sharma (Staff Nurse)',
      role: 'HOSPITAL_STAFF',
      organizationId: 1,
      organizationName: 'ABC Healthcare Demo Hospital',
      organizationSlug: 'abc-healthcare-demo',
      active: true
    },
    {
      id: 4,
      email: 'admin@sunriseclinic.demo',
      password: 'Sunrise@123',
      fullName: 'Dr. Neha Kulkarni (Clinic Head)',
      role: 'HOSPITAL_ADMIN',
      organizationId: 2,
      organizationName: 'Sunrise Clinic Demo',
      organizationSlug: 'sunrise-clinic-demo',
      active: true
    },
    {
      id: 5,
      email: 'rahul.sharma@example.com',
      password: 'User@123',
      fullName: 'Rahul Sharma (Individual User)',
      role: 'INDIVIDUAL_USER',
      organizationId: null,
      organizationName: null,
      organizationSlug: null,
      active: true
    }
  ]),

  getOrganizations: () => getStored<any[]>('organizations', [
    {
      id: 1,
      uniqueSlug: 'abc-healthcare-demo',
      name: 'ABC Healthcare Demo Hospital',
      type: 'Multispecialty Hospital',
      city: 'New Delhi',
      state: 'Delhi',
      status: 'ACTIVE',
      contactPerson: 'Dr. Ramesh Gupta',
      contactEmail: 'hospitaladmin@abchealthcare.demo',
      contactPhone: '+91 11-4567-8900',
      branchesCount: 3,
      staffCount: 65,
      enabledAgentIds: ['patient-followup', 'appointment-management', 'hospital-helpdesk'],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      uniqueSlug: 'sunrise-clinic-demo',
      name: 'Sunrise Clinic Demo',
      type: 'Primary Care Clinic',
      city: 'Mumbai',
      state: 'Maharashtra',
      status: 'ACTIVE',
      contactPerson: 'Dr. Neha Kulkarni',
      contactEmail: 'admin@sunriseclinic.demo',
      contactPhone: '+91 22-2876-5432',
      branchesCount: 1,
      staffCount: 12,
      enabledAgentIds: ['appointment-management', 'multilingual-healthcare'],
      createdAt: new Date().toISOString()
    }
  ]),

  getRequests: () => getStored<HospitalOnboardingRequest[]>('requests', [
    {
      requestId: 1,
      hospitalName: 'Metro City Super Specialty Hospital',
      orgType: 'Super Specialty Hospital',
      contactPerson: 'Dr. Priya Nair',
      email: 'priya.nair@metrocity.demo',
      phone: '+91 98765-43210',
      city: 'Bengaluru',
      state: 'Karnataka',
      branchesCount: 2,
      staffCount: 120,
      requestedAgents: ['patient-followup', 'appointment-management', 'hospital-helpdesk', 'insurance-ayushman'],
      intendedUseCases: 'Automate post-surgical discharge follow-up schedules and patient inquiry front-desk queues.',
      existingSoftware: 'MedPlus HIS v4.2',
      status: 'PENDING_REVIEW',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      requestId: 2,
      hospitalName: 'CareWell Clinic Pune',
      orgType: 'Polyclinic',
      contactPerson: 'Dr. Anand Deshmukh',
      email: 'anand@carewellpune.demo',
      phone: '+91 98989-12121',
      city: 'Pune',
      state: 'Maharashtra',
      branchesCount: 1,
      staffCount: 18,
      requestedAgents: ['appointment-management', 'multilingual-healthcare'],
      intendedUseCases: 'Multilingual OPD reminders in Marathi and English for local community patients.',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]),

  getAppointments: () => getStored<Appointment[]>('appointments', [
    {
      id: 1,
      appointmentRef: 'APT-9041',
      patientNameRef: 'P. Verma (Ref #PT-8421)',
      department: 'Cardiology OPD',
      doctorName: 'Dr. Anita Rao',
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '10:30 AM',
      status: 'CONFIRMED',
      notes: 'Post-angioplasty routine checkup'
    },
    {
      id: 2,
      appointmentRef: 'APT-9042',
      patientNameRef: 'S. Mehra (Ref #PT-7712)',
      department: 'Orthopedics',
      doctorName: 'Dr. R. Iyer',
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '11:15 AM',
      status: 'SCHEDULED',
      notes: 'Right knee arthroscopy follow-up'
    },
    {
      id: 3,
      appointmentRef: 'APT-9043',
      patientNameRef: 'K. Banerjee (Ref #PT-9033)',
      department: 'General Medicine',
      doctorName: 'Dr. S. Nambiar',
      appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '02:00 PM',
      status: 'SCHEDULED',
      notes: 'Type 2 diabetes quarterly review'
    }
  ]),

  getFollowUps: () => getStored<FollowUp[]>('followups', [
    {
      id: 1,
      patientNameRef: 'A. Kumar (#PT-8421)',
      procedureOrDiagnosis: 'Laparoscopic Cholecystectomy Post-Op (48h)',
      followUpDate: new Date().toISOString().split('T')[0],
      assignedStaffName: 'Sister Sunita Sharma',
      status: 'PENDING',
      notes: 'Check pain score, dressing dry, oral fluids'
    },
    {
      id: 2,
      patientNameRef: 'V. Joshi (#PT-9032)',
      procedureOrDiagnosis: 'Day-7 Hypertension Medication Titration',
      followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      assignedStaffName: 'Sister Sunita Sharma',
      status: 'PENDING',
      notes: 'Log morning/evening BP readings'
    },
    {
      id: 3,
      patientNameRef: 'R. Sethi (#PT-6520)',
      procedureOrDiagnosis: 'Cataract Surgery Day-3 Post-Op Review',
      followUpDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      assignedStaffName: 'Sister Sunita Sharma',
      status: 'COMPLETED',
      notes: 'Patient reports clear vision; eye drops confirmed'
    }
  ]),

  getHelpdeskSettings: () => getStored<HelpdeskSettings>('helpdesk', {
    visitingHours: 'General Wards: 5:00 PM – 7:00 PM Daily | ICU: 11:00 AM – 12:00 PM (Strictly 1 visitor)',
    appointmentInstructions: 'Please report 20 minutes prior to your slot at OPD Counter 2 with Government Photo ID (Aadhaar / ABHA).',
    contactPhone: '+91 11-4567-8900 (Emergency Casualty: +91 11-4567-8999)',
    contactEmail: 'helpdesk@abchealthcare.demo',
    generalFaq: 'Q: Where is the pharmacy located? A: Ground floor near Gate 1, open 24x7.\nQ: Is Ayushman Bharat PM-JAY accepted? A: Yes, visit the Ayushman Mitra counter on Ground Floor Block B.'
  }),

  getStaffMembers: () => getStored<StaffMember[]>('staff', [
    {
      membershipId: 1,
      userId: 2,
      email: 'hospitaladmin@abchealthcare.demo',
      fullName: 'Dr. Ramesh Gupta (Hospital Admin)',
      roleTitle: 'Medical Superintendent',
      department: 'Administration',
      active: true,
      joinedAt: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      membershipId: 2,
      userId: 3,
      email: 'staff@abchealthcare.demo',
      fullName: 'Sister Sunita Sharma (Staff Nurse)',
      roleTitle: 'Senior Staff Nurse',
      department: 'OPD & Day Care',
      active: true,
      joinedAt: new Date(Date.now() - 86400000 * 15).toISOString()
    }
  ]),

  getAgents: () => INITIAL_AGENTS,

  // Save helpers
  saveRequests: (reqs: HospitalOnboardingRequest[]) => setStored('requests', reqs),
  saveOrganizations: (orgs: any[]) => setStored('organizations', orgs),
  saveUsers: (users: any[]) => setStored('users', users),
  saveStaff: (staff: StaffMember[]) => setStored('staff', staff),
  saveHelpdesk: (h: HelpdeskSettings) => setStored('helpdesk', h)
};
