import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Agent, Appointment, FollowUp } from '../../types';
import { AgentDemoChat } from '../../components/AgentDemoChat';
import { 
  Stethoscope, 
  Layers, 
  Calendar, 
  CalendarCheck, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const StaffPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDemoAgent, setActiveDemoAgent] = useState<Agent | null>(null);

  useEffect(() => {
    Promise.all([
      api.agents.getMyAgents(),
      api.hospital.getAppointments(),
      api.hospital.getFollowUps()
    ])
      .then(([agRes, aptRes, fuRes]) => {
        setAgents(agRes);
        setAppointments(aptRes);
        setFollowUps(fuRes);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Prominent Demo Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-900 flex items-center justify-between text-xs font-bold shadow-2xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>DEMO MODE — SAMPLE DATA (Clinical Staff Portal)</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-amber-200/80 px-2.5 py-0.5 rounded-full font-extrabold text-amber-900">
            Staff Role Scoped
          </span>
        </div>

        {/* Staff Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                Staff Healthcare Portal
              </span>
              <span className="text-xs text-slate-400 font-semibold">{user?.organizationName}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Welcome, {user?.fullName}
            </h1>
            <p className="text-xs text-slate-500">
              Assigned clinical workflows and authorized AI agents for your shift.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Shift Queue</span>
              <strong className="text-slate-900">{followUps.length} Follow-ups</strong>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Schedule</span>
              <strong className="text-slate-900">{appointments.length} Consultations</strong>
            </div>
          </div>
        </div>

        {/* Permitted AI Agents */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Permitted AI Agents</h2>
            <p className="text-xs text-slate-500">Agents authorized by your hospital administration</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => <div key={n} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>)}
            </div>
          ) : agents.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              No permitted agents assigned to your account.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map(ag => (
                <div key={ag.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{ag.category}</span>
                    <h3 className="font-bold text-base text-slate-900">{ag.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{ag.description}</p>
                  </div>

                  <button
                    onClick={() => setActiveDemoAgent(ag)}
                    className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Agent</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Clinical Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Follow-up tasks */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Pending Post-Discharge Calls</h3>
                <p className="text-xs text-slate-500">Clinical follow-up checklist</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {followUps.map(fu => (
                <div key={fu.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{fu.patientNameRef}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{fu.procedureOrDiagnosis}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Assigned: {fu.assignedStaffName}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    fu.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {fu.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* OPD Appointments */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Today's OPD Consultation List</h3>
                <p className="text-xs text-slate-500">Outpatient clinic queue</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {appointments.map(apt => (
                <div key={apt.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{apt.patientNameRef}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{apt.doctorName} • {apt.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-800 block">{apt.timeSlot}</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {activeDemoAgent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <AgentDemoChat
                agent={activeDemoAgent}
                onClose={() => setActiveDemoAgent(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
