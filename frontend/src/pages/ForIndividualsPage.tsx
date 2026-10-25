import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  HeartHandshake, 
  Pill, 
  Activity, 
  ShieldCheck, 
  Smile, 
  Languages, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ForIndividualsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            <span>B2C Healthcare Assistance for Everyone</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Personal Healthcare Guidance on Your Terms
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Individuals independently register for Swasth360 and access AI healthcare assistance directly. You do not need to belong to a hospital or seek hospital approval.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Create Free Individual Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Medication Guidance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Understand clinician instructions like "take with food", difference between OTC medicines and prescribed doses, and safety precautions in clear, everyday language.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Chronic Care Tracking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Routine care checklists, self-monitoring guidance for Type 2 Diabetes and Hypertension, and lifestyle awareness that supports long-term health stability.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ayushman Bharat & Insurance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Demystify Ayushman Bharat PM-JAY eligibility categories, understand cashless versus reimbursement paperwork, and prepare required KYC documents before visiting a hospital.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Maternal & Child Wellness</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Universal Immunization Programme (UIP) infant milestones, prenatal checklists, and explicit identification of urgent red-flag symptoms requiring emergency hospital care.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Mental Wellness Check-ins</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Supportive mindfulness, box-breathing exercises, and grounding reflections. With integrated Tele-MANAS (14416) crisis safeguards for immediate counselor connections.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multilingual Indic Support</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explain complex medical instructions in Hindi, Marathi, and English so that every patient and caregiver understands their treatment without language barriers.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-emerald-600 rounded-3xl p-8 lg:p-12 text-white text-center space-y-6">
          <h2 className="text-3xl font-extrabold max-w-2xl mx-auto">
            Ready to experience personalized healthcare assistance?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Join thousands of individuals using Swasth360 across India for safe, evidence-based healthcare assistance.
          </p>
          <div>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-emerald-700 font-bold text-base hover:bg-emerald-50 shadow-md transition-all"
            >
              <span>Create Your Individual Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
