import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Lock, 
  PhoneCall, 
  Sparkles 
} from 'lucide-react';

export const ForHospitalsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B Healthcare Enterprise Solution</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            AI Assistance Built for Hospitals and Clinics
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Swasth360 equips healthcare institutions with dedicated, reviewed AI agents designed to handle administrative queues, follow-up communication, and patient navigation.
          </p>
          <div className="pt-2">
            <Link
              to="/hospital-onboarding"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              <span>Submit Hospital Onboarding Request</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tailored Agent Enablement</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enable only the specific agents your hospital requires. Whether you need the Patient Follow-up Agent for surgical wards or the Multilingual Agent for diverse OPD queues, your hospital dashboard only surfaces what is authorized.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Role-Based Staff Access</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hospital Administrators can invite staff members (duty nurses, frontdesk executives, OPD coordinators). Staff accounts inherit their hospital’s tenant isolation and permitted agents.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Strict Multi-Tenant Isolation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No hospital can access another hospital's records, staff rosters, or appointment queues. Every API request is verified against the authenticated user’s organization token.
            </p>
          </div>
        </div>

        {/* What Happens After You Submit */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xs">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The 5-Step Hospital Onboarding Workflow
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              From initial enquiry to active clinical staff utilization through the centralized Swasth360 portal:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Onboarding Request</h4>
              <p className="text-xs text-slate-600">Hospital submits institutional details, contact person, and requested agents.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 text-sm">Admin Review</h4>
              <p className="text-xs text-slate-600">Swasth360 platform team reviews institutional scope and approves onboarding.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-slate-900 text-sm">Org Provisioning</h4>
              <p className="text-xs text-slate-600">Unique organization ID generated; selected AI agents are activated.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">4</span>
              <h4 className="font-bold text-slate-900 text-sm">Admin Setup</h4>
              <p className="text-xs text-slate-600">Hospital administrator logs in, configures helpdesk rules, and invites clinical staff.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">5</span>
              <h4 className="font-bold text-slate-900 text-sm">Staff Workflows</h4>
              <p className="text-xs text-slate-600">Staff utilize the follow-up, appointment reminder, and helpdesk tools seamlessly.</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center py-8">
          <Link
            to="/hospital-onboarding"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all"
          >
            <span>Start Your Hospital Onboarding Request</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
