import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Agent } from '../types';
import { AgentCard } from '../components/AgentCard';
import { AgentDemoChat } from '../components/AgentDemoChat';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Users, 
  FileCheck, 
  Layers,
  ChevronRight,
  ShieldAlert,
  Bot
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [activeDemoAgent, setActiveDemoAgent] = useState<Agent | null>(null);
  const [activeDetailsAgent, setActiveDetailsAgent] = useState<Agent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.agents.getAll()
      .then(data => {
        setAgents(data);
        setLoadingAgents(false);
      })
      .catch(err => {
        console.error('Failed to load agents', err);
        setLoadingAgents(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Specialized AI Healthcare Infrastructure for India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Smarter Healthcare Starts with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">Specialized AI Agents</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Support healthcare workflows, simplify patient communication, and make healthcare information more accessible with Swasth360.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/agents"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-md shadow-brand-600/25 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Explore AI Agents</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/for-hospitals"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs flex items-center justify-center space-x-2 transition-all"
              >
                <span>Partner With Us</span>
                <Building2 className="w-4 h-4 text-slate-500" />
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Zero Hallucinated Prescriptions</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>B2B Multi-Tenant Isolation</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Independent B2C Access</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Pillars Section: B2B vs B2C */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* B2B Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">For Hospitals & Clinics (B2B)</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                AI Assistance for Hospitals and Clinics
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hospitals can request onboarding, choose tailored AI agents based on their clinical requirements, and provide authorized hospital administrators and clinical staff access through their centralized organization portal.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Customized agent enablement per hospital facility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hospital Admin & Staff role-based management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hospital-customized Helpdesk parameters (visiting hours & OPD rules)</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/hospital-onboarding"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <span>Request Hospital Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* B2C Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">For Individuals (B2C)</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Healthcare Assistance for Everyone
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Individuals independently register for Swasth360 and freely access AI agents designed for citizens. You do not need to belong to a hospital, contact a hospital, or obtain hospital approval.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Independent registration with private personal dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Medication guidance, chronic tracking & mental wellness check-ins</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ayushman Bharat PM-JAY document & scheme navigation</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Preview Section */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">The Agent Suite</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                9 Specialized Healthcare AI Agents
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-xl">
                Each agent is purpose-built for a specific clinical or patient education challenge with deterministic safety boundaries.
              </p>
            </div>
            <Link
              to="/agents"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>View All 9 Agents Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingAgents ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onTryDemo={(a) => setActiveDemoAgent(a)}
                  onViewDetails={(a) => setActiveDetailsAgent(a)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Swasth360 Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Operating Model</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            How Swasth360 Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Clear separation between B2B hospital organizational workflows and B2C individual access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hospital Workflow Steps */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">B2B</div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Hospital Onboarding Journey</h3>
                <p className="text-xs text-slate-500">For healthcare facilities, clinics, and hospital networks</p>
              </div>
            </div>

            <ol className="relative border-l border-slate-200 ml-3 space-y-6 text-sm">
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full text-white text-xs font-bold">1</span>
                <h4 className="font-bold text-slate-900">Submit an onboarding request</h4>
                <p className="text-slate-600 text-xs mt-1">Hospital submits verified details, staff headcount, and agents of interest.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full text-white text-xs font-bold">2</span>
                <h4 className="font-bold text-slate-900">Swasth360 reviews the request</h4>
                <p className="text-slate-600 text-xs mt-1">Platform administration reviews institutional credentials and clinical scope.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full text-white text-xs font-bold">3</span>
                <h4 className="font-bold text-slate-900">Organization created & agents enabled</h4>
                <p className="text-slate-600 text-xs mt-1">Hospital tenant is provisioned with tailored agent permissions.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full text-white text-xs font-bold">4</span>
                <h4 className="font-bold text-slate-900">Hospital administrator receives access</h4>
                <p className="text-slate-600 text-xs mt-1">Admin activates secure account, customizes helpdesk parameters, and invites staff.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full text-white text-xs font-bold">5</span>
                <h4 className="font-bold text-slate-900">Authorized staff use the agents</h4>
                <p className="text-slate-600 text-xs mt-1">Clinical staff streamline follow-ups, reminder queues, and OPD workflows.</p>
              </li>
            </ol>
          </div>

          {/* Individual Workflow Steps */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">B2C</div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Individual User Journey</h3>
                <p className="text-xs text-slate-500">For patients, caregivers, and families across India</p>
              </div>
            </div>

            <ol className="relative border-l border-slate-200 ml-3 space-y-6 text-sm">
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full text-white text-xs font-bold">1</span>
                <h4 className="font-bold text-slate-900">Register Independently</h4>
                <p className="text-slate-600 text-xs mt-1">Create an individual account with your email. No hospital authorization needed.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full text-white text-xs font-bold">2</span>
                <h4 className="font-bold text-slate-900">Log In to Personal Dashboard</h4>
                <p className="text-slate-600 text-xs mt-1">Access your secure, isolated citizen health interface.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full text-white text-xs font-bold">3</span>
                <h4 className="font-bold text-slate-900">Explore Available Citizen Agents</h4>
                <p className="text-slate-600 text-xs mt-1">Select from medication guidance, maternal health, chronic self-care, or Ayushman Bharat navigation.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full text-white text-xs font-bold">4</span>
                <h4 className="font-bold text-slate-900">Use Selected Agents Safely</h4>
                <p className="text-slate-600 text-xs mt-1">Receive evidence-based explanations with clear medical disclaimers.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Safety & Non-Directory Rule Notice */}
      <section className="py-12 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-800 text-teal-200 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>Platform Ethics & Clinical Responsibility</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-2xl mx-auto">
            "Swasth360 is an AI-assisted healthcare platform. It does not replace qualified healthcare professionals or provide emergency medical services."
          </h2>
          <p className="text-teal-200 text-sm max-w-xl mx-auto">
            Swasth360 is NOT a hospital directory or search engine. Hospitals onboard as organizations to unlock intelligent workflow agents for their patient communities.
          </p>
        </div>
      </section>

      {/* Interactive Demo Chat Modal */}
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

      {/* View Details Modal */}
      {activeDetailsAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{activeDetailsAgent.name}</h3>
                  <span className="text-xs text-brand-600 font-semibold">{activeDetailsAgent.category}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveDetailsAgent(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm text-slate-600">
              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Purpose & Description</h4>
                <p className="leading-relaxed">{activeDetailsAgent.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Target Role & Users</h4>
                <p>{activeDetailsAgent.intendedUsers}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1">Access Requirements</h4>
                <p className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {activeDetailsAgent.isHospitalAgent && activeDetailsAgent.isIndividualAgent
                    ? "Available to both onboarded hospitals (via staff portal) and independent individual users."
                    : activeDetailsAgent.isHospitalAgent
                    ? "Restricted to onboarded hospitals. Requires Swasth360 Admin approval and organization enablement."
                    : "Available directly to registered individual citizens."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setActiveDetailsAgent(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const ag = activeDetailsAgent;
                  setActiveDetailsAgent(null);
                  setActiveDemoAgent(ag);
                }}
                className="px-4 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold flex items-center space-x-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Demo Interface</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
