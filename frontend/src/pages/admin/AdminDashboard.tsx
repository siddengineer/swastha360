import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { HospitalOnboardingRequest, OrganizationSummary } from '../../types';
import { 
  Building2, 
  FileText, 
  Layers, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<HospitalOnboardingRequest[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.getRequests(),
      api.admin.getOrganizations()
    ])
      .then(([reqs, orgs]) => {
        setRequests(reqs);
        setOrganizations(orgs);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'PENDING_REVIEW' || r.status === 'UNDER_REVIEW');
  const activeOrgs = organizations.filter(o => o.status === 'ACTIVE');

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                Platform Administration
              </span>
              <span className="text-xs text-slate-500 font-mono">Role: SWASTH360_ADMIN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Swasth360 Platform Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage hospital onboarding applications, configure tenant organizations, and govern AI agent allocations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/hospital-requests"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs"
            >
              Review Requests ({pendingRequests.length})
            </Link>
            <Link
              to="/admin/organizations/create"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1"
            >
              <span>Create Organization</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Enquiries</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{pendingRequests.length}</div>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting administrator verification</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Onboarded Hospitals</span>
              <Building2 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{organizations.length}</div>
            <p className="text-[11px] text-blue-700 font-medium">{activeOrgs.length} Active / {organizations.length - activeOrgs.length} Suspended</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
              <FileText className="w-5 h-5 text-teal-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{requests.length}</div>
            <p className="text-[11px] text-teal-700 font-medium">Lifetime onboarding submissions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Specialized Agents</span>
              <Layers className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">9</div>
            <p className="text-[11px] text-indigo-700 font-medium">Full clinical & citizen suite</p>
          </div>
        </div>

        {/* Quick Review Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Onboarding Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recent Hospital Enquiries</h3>
                <p className="text-xs text-slate-500">Submissions requiring administrative action</p>
              </div>
              <Link to="/admin/hospital-requests" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(n => <div key={n} className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>)}
              </div>
            ) : requests.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No onboarding requests found.</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 4).map(req => (
                  <div key={req.requestId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{req.hospitalName}</span>
                        <span className="text-[10px] text-slate-400">#REQ-{req.requestId}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {req.contactPerson} ({req.city}, {req.state})
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' :
                      req.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Organizations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Provisioned Organizations</h3>
                <p className="text-xs text-slate-500">Live hospital tenants with enabled agents</p>
              </div>
              <Link to="/admin/organizations" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                Manage
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(n => <div key={n} className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>)}
              </div>
            ) : organizations.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No organizations provisioned yet.</p>
            ) : (
              <div className="space-y-3">
                {organizations.slice(0, 4).map(org => (
                  <div key={org.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{org.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">/{org.uniqueSlug}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {org.city}, {org.state} • {org.enabledAgentsCount} Agents Enabled
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      org.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {org.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
