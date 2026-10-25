import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Lock, EyeOff, FileText, PhoneCall } from 'lucide-react';

export const PrivacySafetyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Clinical Integrity & Safety Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy and Safety Information
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Swasth360 is committed to ethical, transparent, and legally responsible AI assistance in Indian healthcare.
          </p>
        </div>

        {/* Emergency Callout Card */}
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-rose-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Emergency Medical Services & National Helplines</span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed">
            If you or someone in your care is experiencing acute chest pain, severe breathlessness, uncontrolled bleeding, poisoning, trauma, or thoughts of self-harm, immediately utilize these official national helplines:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">National Emergency</span>
              <strong className="text-lg text-rose-700">112</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Ambulance Services</span>
              <strong className="text-lg text-rose-700">108 / 102</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Tele-MANAS (Mental Health)</span>
              <strong className="text-lg text-rose-700">14416</strong>
            </div>
          </div>
        </div>

        {/* Safety Principles */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>1. Non-Diagnostic Medical Scope</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Swasth360 AI agents do not formulate medical diagnoses, modify clinician prescriptions, or recommend discontinuation of therapy. All outputs are strictly educational, designed to help patients understand medical terminology, schedule follow-ups, and navigate healthcare systems.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-brand-600" />
              <span>2. Multi-Tenant Architectural Isolation</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hospital tenant data is cryptographically and logically isolated. A hospital administrator or clinical staff member from Hospital A cannot access, query, or infer appointments, follow-ups, or helpdesk data belonging to Hospital B. Independent individual accounts (B2C) remain completely unlinked from hospital enterprise data.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-brand-600" />
              <span>3. Demonstration Data Integrity</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In this functional prototype, all hospital figures, patient references (such as PT-8421), OPD schedules, and clinician designations are realistic but fictional sample data. Swasth360 does not collect, store, or process real Patient Health Information (PHI) in this prototype environment.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>4. Product Distinction Rule</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Swasth360 is NOT a hospital discovery directory or medical marketplace. We do not rank, review, or index hospitals for public search. Hospitals are enterprise organizations that onboard onto Swasth360 to manage specialized AI agents for their authorized clinical teams and patient communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
