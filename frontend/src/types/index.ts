export type Role = 'SWASTH360_ADMIN' | 'HOSPITAL_ADMIN' | 'HOSPITAL_STAFF' | 'INDIVIDUAL_USER';

export type OrgStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_SETUP';

export type RequestStatus = 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  organizationId?: number | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
  active: boolean;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  organizationId?: number | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  intendedUsers: string;
  isHospitalAgent: boolean;
  isIndividualAgent: boolean;
  defaultAvailability: string;
  iconName: string;
  enabledForTenant?: boolean;
}

export interface HospitalOnboardingRequest {
  requestId: number;
  hospitalName: string;
  orgType: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  branchesCount: number;
  staffCount: number;
  requestedAgents: string[];
  intendedUseCases: string;
  existingSoftware?: string;
  additionalNotes?: string;
  status: RequestStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSummary {
  id: number;
  uniqueSlug: string;
  name: string;
  type: string;
  city: string;
  state: string;
  status: OrgStatus;
  enabledAgentsCount: number;
  staffCount: number;
  createdAt: string;
}

export interface OrganizationDetail extends OrganizationSummary {
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  branchesCount: number;
  enabledAgentIds: string[];
}

export interface Appointment {
  id: number;
  appointmentRef: string;
  patientNameRef: string;
  department: string;
  doctorName: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes: string;
}

export interface FollowUp {
  id: number;
  patientNameRef: string;
  procedureOrDiagnosis: string;
  followUpDate: string;
  assignedStaffName: string;
  status: string;
  notes: string;
}

export interface StaffMember {
  membershipId: number;
  userId: number;
  email: string;
  fullName: string;
  phone?: string;
  roleTitle: string;
  department: string;
  active: boolean;
  joinedAt: string;
}

export interface HelpdeskSettings {
  visitingHours: string;
  appointmentInstructions: string;
  contactPhone: string;
  contactEmail: string;
  generalFaq: string;
}

export interface HospitalDashboardData {
  organizationId: number;
  organizationName: string;
  organizationSlug: string;
  status: OrgStatus;
  enabledAgentsCount: number;
  activeStaffCount: number;
  upcomingAppointmentsCount: number;
  pendingFollowUpsCount: number;
  enabledAgents: Agent[];
  recentAppointments: Appointment[];
  pendingFollowUps: FollowUp[];
  helpdeskSettings: HelpdeskSettings;
}

export interface SavedConversationSummary {
  id: number;
  agentId: string;
  agentName: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

export interface IndividualDashboardData {
  userId: number;
  fullName: string;
  email: string;
  availableAgents: Agent[];
  recentConversations: SavedConversationSummary[];
  totalSavedInteractions: number;
}

export interface EscalationInfo {
  crisis: boolean;
  helplineName?: string;
  helplineNumber?: string;
  recommendedAction?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  actionData?: Record<string, any>;
  escalation?: EscalationInfo;
  safetyNotice?: string;
  modelUsed?: string;
}

export interface ChatResponse {
  agentId: string;
  agentName: string;
  reply: string;
  suggestions: string[];
  actionData?: Record<string, any>;
  safetyNotice: string;
  modelUsed: string;
  escalation?: EscalationInfo;
  conversationId?: number;
}
