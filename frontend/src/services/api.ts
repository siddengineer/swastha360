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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('swasth360_token');
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

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

  return res.json();
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
