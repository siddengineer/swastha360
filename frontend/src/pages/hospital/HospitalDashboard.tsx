import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { HospitalDashboardData, Agent } from '../../types';
import { AgentDemoChat } from '../../components/AgentDemoChat';
import { 
  Building2, 
  Layers, 
  Users, 
  Calendar, 
  CalendarCheck, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  Search,
  ExternalLink,
  Settings
} from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const [data, setData] = useState<HospitalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAgentDemo, setActiveAgentDemo] = useState<Agent | null>(null);

  useEffect(() => {
    api.hospital.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load hospital dashboard.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading hospital dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600">{error || 'Unable to fetch dashboard data.'}</p>
          <Link to="/login" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Prominent Demo Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-900 flex items-center justify-between text-xs font-bold shadow-2xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>DEMO MODE — SAMPLE DATA (Fictional Records Only)</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-amber-200/80 px-2.5 py-0.5 rounded-full font-extrabold text-amber-900">
            Tenant Isolated
          </span>
        </div>

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                data.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {data.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">/{data.organizationSlug}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {data.organizationName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Hospital Operations and AI Agent Workspace Portal
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/hospital/helpdesk-settings"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs flex items-center space-x-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Helpdesk Settings</span>
            </Link>
            <Link
              to="/hospital/staff"
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Management ({data.activeStaffCount})</span>
            </Link>
          </div>
        </div>

        {/* Metric Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Enabled Agents</span>
              <Layers className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{data.enabledAgentsCount}</div>
            <p className="text-[11px] text-brand-700 font-medium">Activated for this hospital</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Active Staff</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{data.activeStaffCount}</div>
            <p className="text-[11px] text-blue-700 font-medium">Authorized clinical accounts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Demo Appointments</span>
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{data.upcomingAppointmentsCount}</div>
            <p className="text-[11px] text-teal-700 font-medium">Upcoming OPD slots</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Pending Follow-ups</span>
              <CalendarCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{data.pendingFollowUpsCount}</div>
            <p className="text-[11px] text-amber-700 font-medium">Awaiting discharge checks</p>
          </div>
        </div>

        {/* Enabled Agents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enabled AI Agents for {data.organizationName}</h2>
              <p className="text-xs text-slate-500">Only the AI agents authorized by Swasth360 are surfaced here</p>
            </div>
          </div>

          {data.enabledAgents.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              No AI agents enabled yet. Please contact Swasth360 administration to enable agents.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.enabledAgents.map(agent => (
                <div
                  key={agent.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{agent.category}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{agent.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{agent.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">{agent.intendedUsers}</span>
                    <button
                      onClick={() => setActiveAgentDemo(agent)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open Agent</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments & Follow-ups Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sample Upcoming Appointments */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Upcoming Demo OPD Appointments</h3>
                <p className="text-xs text-slate-500">Sample clinical outpatient schedule</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">DEMO SCHEDULE</span>
            </div>

            <div className="space-y-2.5">
              {data.recentAppointments.map(apt => (
                <div key={apt.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{apt.patientNameRef}</span>
                      <span className="font-mono text-[10px] text-slate-400">{apt.appointmentRef}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {apt.doctorName} • {apt.department}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{apt.notes}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-800 block">{apt.timeSlot}</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Pending Follow-ups */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Pending Patient Follow-up Calls</h3>
                <p className="text-xs text-slate-500">Handled by Patient Follow-up Agent & Nurses</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">DEMO SCHEDULE</span>
            </div>

            <div className="space-y-2.5">
              {data.pendingFollowUps.map(fu => (
                <div key={fu.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{fu.patientNameRef}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{fu.procedureOrDiagnosis}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Assigned: {fu.assignedStaffName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      fu.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {fu.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Agent Modal */}
        {activeAgentDemo && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <AgentDemoChat
                agent={activeAgentDemo}
                onClose={() => setActiveAgentDemo(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
