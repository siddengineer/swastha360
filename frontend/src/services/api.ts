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
import { mockStore } from './mockStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let isUsingMock = false;

export const isLiveBackendConnected = () => !isUsingMock;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('swasth360_token');
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errMsg = `Request failed (${res.status})`;
      try {
        const errJson = await res.json();
        errMsg = errJson.message || errJson.error || errJson.detail || errMsg;
      } catch {
        const text = await res.text();
        if (text) errMsg = text;
      }
      throw new ApiError(errMsg, res.status);
    }

    if (res.status === 204) {
      return {} as T;
    }

    isUsingMock = false;
    return res.json();
  } catch (err: any) {
    // If it's a real HTTP status error returned by the server (e.g. 401, 403), rethrow it
    if (err instanceof ApiError) {
      throw err;
    }

    // Network failure (server down, offline, or deployed as Static Site without backend)
    console.info(`[Swasth360] Remote API unreachable. Running in zero-cost in-browser demo mode for endpoint: ${endpoint}`);
    isUsingMock = true;
    return handleMockRequest<T>(endpoint, options);
  }
}

// -----------------------------------------------------------------------------
// In-Browser Mock Handler for 100% Free Static Hosting (Render / Netlify / Vercel)
// -----------------------------------------------------------------------------
function handleMockRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // Auth: Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const users = mockStore.getUsers();
    const user = users.find(u => u.email.toLowerCase() === body.email.toLowerCase().trim());
    if (!user || user.password !== body.password) {
      return Promise.reject(new ApiError('Invalid email or password', 401));
    }
    const token = 'mock_jwt_token_' + btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role }));
    const resp: AuthResponse = {
      token,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      organizationSlug: user.organizationSlug
    };
    return Promise.resolve(resp as unknown as T);
  }

  // Auth: Register
  if (endpoint === '/auth/register' && method === 'POST') {
    const users = mockStore.getUsers();
    const newUser = {
      id: Date.now(),
      email: body.email.toLowerCase().trim(),
      password: body.password,
      fullName: body.fullName,
      role: 'INDIVIDUAL_USER',
      organizationId: null,
      organizationName: null,
      organizationSlug: null,
      active: true
    };
    users.push(newUser);
    mockStore.saveUsers(users);

    const token = 'mock_jwt_token_' + btoa(JSON.stringify({ userId: newUser.id, email: newUser.email, role: newUser.role }));
    const resp: AuthResponse = {
      token,
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: 'INDIVIDUAL_USER',
      organizationId: null,
      organizationName: null,
      organizationSlug: null
    };
    return Promise.resolve(resp as unknown as T);
  }

  // Auth: Me
  if (endpoint === '/auth/me') {
    const saved = localStorage.getItem('swasth360_user');
    if (saved) return Promise.resolve(JSON.parse(saved) as T);
    return Promise.reject(new ApiError('Unauthenticated', 401));
  }

  // Onboarding Submit
  if (endpoint === '/hospital-onboarding' && method === 'POST') {
    const reqs = mockStore.getRequests();
    const newReq: HospitalOnboardingRequest = {
      requestId: reqs.length + 1,
      hospitalName: body.hospitalName,
      orgType: body.orgType || 'Multispecialty Hospital',
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      city: body.city || 'New Delhi',
      state: body.state || 'Delhi',
      branchesCount: body.branchesCount || 1,
      staffCount: body.staffCount || 20,
      requestedAgents: body.requestedAgents || ['patient-followup', 'appointment-management'],
      intendedUseCases: body.intendedUseCases || '',
      existingSoftware: body.existingSoftware || '',
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    reqs.unshift(newReq);
    mockStore.saveRequests(reqs);
    return Promise.resolve(newReq as unknown as T);
  }

  // Admin: Get Requests
  if (endpoint === '/admin/hospital-requests' && method === 'GET') {
    return Promise.resolve(mockStore.getRequests() as unknown as T);
  }

  // Admin: Update Request Status
  if (endpoint.startsWith('/admin/hospital-requests/') && endpoint.endsWith('/status') && method === 'PATCH') {
    const id = parseInt(endpoint.split('/')[3]);
    const reqs = mockStore.getRequests();
    const target = reqs.find(r => r.requestId === id);
    if (target) {
      target.status = body.status;
      target.rejectionReason = body.rejectionReason || null;
      target.updatedAt = new Date().toISOString();
      mockStore.saveRequests(reqs);
      return Promise.resolve(target as unknown as T);
    }
  }

  // Admin: Create Organization
  if (endpoint === '/admin/organizations' && method === 'POST') {
    const orgs = mockStore.getOrganizations();
    const newOrg = {
      id: orgs.length + 1,
      uniqueSlug: body.uniqueSlug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: body.name,
      type: body.orgType || 'Multispecialty Hospital',
      city: body.city || 'New Delhi',
      state: body.state || 'Delhi',
      status: 'ACTIVE' as OrgStatus,
      contactPerson: body.adminFullName,
      contactEmail: body.adminEmail,
      contactPhone: body.adminPhone || '+91 11-4567-8900',
      branchesCount: 1,
      staffCount: 15,
      enabledAgentIds: body.enabledAgentIds || ['patient-followup', 'appointment-management', 'hospital-helpdesk'],
      createdAt: new Date().toISOString()
    };
    orgs.push(newOrg);
    mockStore.saveOrganizations(orgs);

    // Create admin user
    const users = mockStore.getUsers();
    users.push({
      id: Date.now(),
      email: body.adminEmail.toLowerCase().trim(),
      password: body.adminPassword || 'Hospital@123',
      fullName: body.adminFullName,
      role: 'HOSPITAL_ADMIN',
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      organizationSlug: newOrg.uniqueSlug,
      active: true
    });
    mockStore.saveUsers(users);

    return Promise.resolve(newOrg as unknown as T);
  }

  // Admin: Get Organizations
  if (endpoint === '/admin/organizations' && method === 'GET') {
    const orgs = mockStore.getOrganizations().map(o => ({
      id: o.id,
      uniqueSlug: o.uniqueSlug,
      name: o.name,
      type: o.type,
      city: o.city,
      state: o.state,
      status: o.status,
      enabledAgentsCount: o.enabledAgentIds ? o.enabledAgentIds.length : 3,
      staffCount: o.staffCount || 10,
      createdAt: o.createdAt
    }));
    return Promise.resolve(orgs as unknown as T);
  }

  // Admin: Get Organization by ID
  if (endpoint.startsWith('/admin/organizations/') && method === 'GET') {
    const id = parseInt(endpoint.split('/')[3]);
    const org = mockStore.getOrganizations().find(o => o.id === id);
    if (org) return Promise.resolve(org as unknown as T);
  }

  // Admin: Update Org Agents
  if (endpoint.includes('/agents') && method === 'PATCH') {
    const id = parseInt(endpoint.split('/')[3]);
    const orgs = mockStore.getOrganizations();
    const target = orgs.find(o => o.id === id);
    if (target) {
      target.enabledAgentIds = body.enabledAgentIds;
      mockStore.saveOrganizations(orgs);
      return Promise.resolve(target as unknown as T);
    }
  }

  // Admin: Update Org Status
  if (endpoint.includes('/status') && method === 'PATCH') {
    const id = parseInt(endpoint.split('/')[3]);
    const orgs = mockStore.getOrganizations();
    const target = orgs.find(o => o.id === id);
    if (target) {
      target.status = body.status;
      mockStore.saveOrganizations(orgs);
      return Promise.resolve(target as unknown as T);
    }
  }

  // Hospital Dashboard
  if (endpoint === '/hospital/dashboard') {
    const allAgents = mockStore.getAgents();
    const currentOrg = mockStore.getOrganizations()[0];
    const enabledAgents = allAgents.filter(a => currentOrg.enabledAgentIds.includes(a.id));
    const apts = mockStore.getAppointments();
    const fus = mockStore.getFollowUps();
    const staff = mockStore.getStaffMembers();
    const helpdesk = mockStore.getHelpdeskSettings();

    const data: HospitalDashboardData = {
      organizationId: currentOrg.id,
      organizationName: currentOrg.name,
      organizationSlug: currentOrg.uniqueSlug,
      status: currentOrg.status,
      enabledAgentsCount: enabledAgents.length,
      activeStaffCount: staff.length,
      upcomingAppointmentsCount: apts.length,
      pendingFollowUpsCount: fus.length,
      enabledAgents,
      recentAppointments: apts,
      pendingFollowUps: fus,
      helpdeskSettings: helpdesk
    };
    return Promise.resolve(data as unknown as T);
  }

  // Hospital Appointments
  if (endpoint === '/hospital/appointments') {
    return Promise.resolve(mockStore.getAppointments() as unknown as T);
  }

  // Hospital Follow-ups
  if (endpoint === '/hospital/follow-ups') {
    return Promise.resolve(mockStore.getFollowUps() as unknown as T);
  }

  // Hospital Staff
  if (endpoint === '/hospital/staff' && method === 'GET') {
    return Promise.resolve(mockStore.getStaffMembers() as unknown as T);
  }

  // Hospital Invite Staff
  if (endpoint === '/hospital/staff' && method === 'POST') {
    const staff = mockStore.getStaffMembers();
    const newMember: StaffMember = {
      membershipId: Date.now(),
      userId: Date.now() + 1,
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      roleTitle: body.roleTitle,
      department: body.department,
      active: true,
      joinedAt: new Date().toISOString()
    };
    staff.push(newMember);
    mockStore.saveStaff(staff);
    return Promise.resolve(newMember as unknown as T);
  }

  // Hospital Helpdesk Settings
  if (endpoint === '/hospital/helpdesk-settings' && method === 'GET') {
    return Promise.resolve(mockStore.getHelpdeskSettings() as unknown as T);
  }
  if (endpoint === '/hospital/helpdesk-settings' && method === 'PUT') {
    mockStore.saveHelpdesk(body);
    return Promise.resolve(body as unknown as T);
  }

  // Individual Dashboard
  if (endpoint === '/hospital/dashboard' || endpoint === '/individual/dashboard') {
    const savedUser = JSON.parse(localStorage.getItem('swasth360_user') || '{}');
    const allAgents = mockStore.getAgents();
    const b2cAgents = allAgents.filter(a => a.isIndividualAgent);
    const data: IndividualDashboardData = {
      userId: savedUser.id || 5,
      fullName: savedUser.fullName || 'Citizen User',
      email: savedUser.email || 'user@example.com',
      availableAgents: b2cAgents,
      recentConversations: [
        {
          id: 101,
          agentId: 'medication-guidance',
          agentName: 'Medication Guidance Agent',
          title: 'Understanding food timing for Metformin',
          createdAt: new Date().toISOString(),
          messageCount: 4
        }
      ],
      totalSavedInteractions: 1
    };
    return Promise.resolve(data as unknown as T);
  }

  // Agents: Get All
  if (endpoint === '/agents') {
    return Promise.resolve(mockStore.getAgents() as unknown as T);
  }

  // Agents: My Agents
  if (endpoint === '/agents/my') {
    const savedUser = JSON.parse(localStorage.getItem('swasth360_user') || '{}');
    const allAgents = mockStore.getAgents();
    if (savedUser.role === 'SWASTH360_ADMIN') return Promise.resolve(allAgents as unknown as T);
    if (savedUser.role === 'INDIVIDUAL_USER') {
      return Promise.resolve(allAgents.filter(a => a.isIndividualAgent) as unknown as T);
    }
    const currentOrg = mockStore.getOrganizations()[0];
    return Promise.resolve(allAgents.filter(a => currentOrg.enabledAgentIds.includes(a.id)) as unknown as T);
  }

  // Agents: Chat Endpoint
  if (endpoint.startsWith('/agents/') && endpoint.endsWith('/chat') && method === 'POST') {
    const agentId = endpoint.split('/')[2];
    const text = (body.message || '').toLowerCase();
    const helpdesk = mockStore.getHelpdeskSettings();

    // Crisis escalation trigger
    if (text.includes('suicide') || text.includes('end my life') || text.includes('kill myself') || text.includes('self-harm')) {
      const crisisResp: ChatResponse = {
        agentId,
        agentName: 'Mental Wellness Check-in Agent',
        reply: "We care deeply about your safety. You do not have to carry this alone. Please connect immediately with free, confidential 24x7 support:\n\n• Tele-MANAS (Govt. of India): 14416 or 1800-891-4416 (Toll-Free)\n• National Emergency Helpline: 112",
        suggestions: ['Call Tele-MANAS (14416)', 'Contact Emergency (112)'],
        safetyNotice: 'CRISIS NOTICE: Immediate support is available 24x7.',
        modelUsed: 'Swasth360 Crisis Escalation Guard',
        escalation: {
          crisis: true,
          helplineName: 'Tele-MANAS',
          helplineNumber: '14416',
          recommendedAction: 'Immediate connection to trained mental health counselor'
        }
      };
      return Promise.resolve(crisisResp as unknown as T);
    }

    let reply = `Namaste! I am your AI healthcare assistant. Here is guidance for: "${body.message}".`;
    let actionData: Record<string, any> | undefined = undefined;

    if (agentId === 'patient-followup') {
      reply = "📋 **Draft Follow-up Reminder Prepared for Clinical Approval:**\n\n\"Dear Patient (Ref: #PT-8421), this is a 48-hour post-discharge check from your care team. Please reply '1' if you are taking your prescriptions smoothly, or '2' if you have mild dressing concerns. For severe pain, contact our casualty at 011-2345-6789.\"";
      actionData = { type: 'draft_reminder', patientRef: 'PT-8421', status: 'Pending Review' };
    } else if (agentId === 'appointment-management') {
      reply = "🗓️ **Appointment Reminder Generated:**\n\n\"Namaste! Your consultation with Dr. Anita Rao (Cardiology OPD) is scheduled for Tomorrow at 10:30 AM at OPD Room 204. Please arrive 15 minutes early with your photo ID and previous clinical reports.\"";
      actionData = { doctor: 'Dr. Anita Rao', dept: 'Cardiology', slot: 'Tomorrow, 10:30 AM' };
    } else if (agentId === 'medication-guidance') {
      reply = "💊 **Understanding 'Take with Food':**\n\n• Certain medications (like NSAIDs or Metformin) can irritate the stomach lining. Taking them with a meal or snack provides a protective buffer.\n• Never alter or discontinue prescribed medication without your doctor's direction.";
    } else if (agentId === 'hospital-helpdesk') {
      reply = `🏥 **ABC Healthcare Helpdesk:**\n\n• **Visiting Hours:** ${helpdesk.visitingHours}\n• **Instructions:** ${helpdesk.appointmentInstructions}\n• **Helpline:** ${helpdesk.contactPhone}`;
    } else if (agentId === 'multilingual-healthcare') {
      if (body.language === 'hi' || text.includes('hindi') || text.includes('दवा')) {
        reply = "🇮🇳 **हिंदी में स्वास्थ्य मार्गदर्शन:**\n\n• **'खाली पेट लें' (Take on empty stomach):** दवा सुबह उठने के तुरंत बाद सादे पानी के साथ लें, और 30-45 मिनट तक चाय या नाश्ता न करें।";
      } else if (body.language === 'mr' || text.includes('marathi')) {
        reply = "🚩 **मराठीत आरोग्य मार्गदर्शन:**\n\n• **'उपाशी पोटी औषध घेणे':** औषध सकाळी चहा किंवा नाश्त्यापूर्वी किमान ३०-४५ मिनिटे आधी साध्या पाण्यासोबत घ्यावे.";
      } else {
        reply = "🌐 **Multilingual Instructions (English / Hindi / Marathi):**\n\n• **English:** Take on empty stomach before breakfast.\n• **हिंदी:** सुबह नाश्ते से आधा घंटा पहले खाली पेट लें।\n• **मराठी:** सकाळी नाश्त्यापूर्वी ३० मिनिटे उपाशी पोटी घ्यावे.";
      }
    } else if (agentId === 'mental-wellness') {
      reply = "🧘 **Guided Box Breathing Exercise (4-4-4-4):**\n\n1. Inhale slowly for 4 seconds...\n2. Hold your breath gently for 4 seconds...\n3. Exhale smoothly for 4 seconds...\n4. Rest at empty for 4 seconds.\n\nRepeat 3-4 times to relax your nervous system.";
      actionData = { exercise: 'Box Breathing', duration: '2 Minutes' };
    }

    const chatResp: ChatResponse = {
      agentId,
      agentName: 'Swasth360 AI Assistant',
      reply,
      suggestions: ['Show sample checklist', 'Explain medical terms'],
      actionData,
      safetyNotice: 'Swasth360 is an AI-assisted healthcare demonstration platform. It does not replace qualified medical diagnosis or emergency care.',
      modelUsed: 'Swasth360 Fallback Demonstration Engine',
      conversationId: Date.now()
    };
    return Promise.resolve(chatResp as unknown as T);
  }

  return Promise.resolve({} as T);
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (data: { fullName: string; email: string; password: string; phone?: string; termsAccepted: boolean }) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: () => request<User>('/auth/me'),
  },

  // Onboarding (Public submission)
  onboarding: {
    submit: (data: {
      hospitalName: string;
      orgType: string;
      contactPerson: string;
      email: string;
      phone: string;
      city: string;
      state: string;
      branchesCount?: number;
      staffCount?: number;
      requestedAgents?: string[];
      intendedUseCases?: string;
      existingSoftware?: string;
      additionalNotes?: string;
      consentToContact: boolean;
    }) =>
      request<HospitalOnboardingRequest>('/hospital-onboarding', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Swasth360 Admin
  admin: {
    getRequests: () => request<HospitalOnboardingRequest[]>('/admin/hospital-requests'),
    getRequestById: (id: number) => request<HospitalOnboardingRequest>(`/admin/hospital-requests/${id}`),
    updateRequestStatus: (id: number, status: RequestStatus, rejectionReason?: string) =>
      request<HospitalOnboardingRequest>(`/admin/hospital-requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      }),
    createOrganization: (data: {
      requestId?: number;
      name: string;
      uniqueSlug?: string;
      orgType?: string;
      city?: string;
      state?: string;
      enabledAgentIds?: string[];
      adminEmail: string;
      adminFullName: string;
      adminPassword?: string;
      adminPhone?: string;
    }) =>
      request<OrganizationDetail>('/admin/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getOrganizations: () => request<OrganizationSummary[]>('/admin/organizations'),
    getOrganizationById: (id: number) => request<OrganizationDetail>(`/admin/organizations/${id}`),
    updateOrgAgents: (id: number, enabledAgentIds: string[]) =>
      request<OrganizationDetail>(`/admin/organizations/${id}/agents`, {
        method: 'PATCH',
        body: JSON.stringify({ enabledAgentIds }),
      }),
    updateOrgStatus: (id: number, status: OrgStatus) =>
      request<OrganizationDetail>(`/admin/organizations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Hospital Portal
  hospital: {
    getDashboard: () => request<HospitalDashboardData>('/hospital/dashboard'),
    getAppointments: () => request<Appointment[]>('/hospital/appointments'),
    getFollowUps: () => request<FollowUp[]>('/hospital/follow-ups'),
    getStaff: () => request<StaffMember[]>('/hospital/staff'),
    inviteStaff: (data: {
      fullName: string;
      email: string;
      password?: string;
      phone?: string;
      roleTitle: string;
      department: string;
      role: 'HOSPITAL_STAFF' | 'HOSPITAL_ADMIN';
    }) =>
      request<StaffMember>('/hospital/staff', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getHelpdeskSettings: () => request<HelpdeskSettings>('/hospital/helpdesk-settings'),
    updateHelpdeskSettings: (data: HelpdeskSettings) =>
      request<HelpdeskSettings>('/hospital/helpdesk-settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Individual B2C Portal
  individual: {
    getDashboard: () => request<IndividualDashboardData>('/individual/dashboard'),
    getConversations: () => request<SavedConversationSummary[]>('/individual/conversations'),
  },

  // Agents & Chat
  agents: {
    getAll: () => request<Agent[]>('/agents'),
    getMyAgents: () => request<Agent[]>('/agents/my'),
    chat: (agentId: string, message: string, conversationId?: number, language: string = 'en') =>
      request<ChatResponse>(`/agents/${agentId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message, conversationId, language }),
      }),
  },
};
