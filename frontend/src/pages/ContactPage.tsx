import React from 'react';
import { Mail, Phone, MapPin, ShieldAlert, Clock, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Swasth360
          </h1>
          <p className="text-slate-600 text-sm">
            Reach out to our technology, compliance, or hospital partnership teams.
          </p>
        </div>

        {/* Emergency Alert Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-950">Not For Medical Emergencies</p>
            <p className="text-amber-800 text-[11px] mt-0.5">
              Swasth360 does not provide immediate emergency medical response. For life-threatening emergencies, please dial <strong className="text-amber-950">112 / 108</strong> immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Hospital Partnerships</h3>
            <p className="text-xs text-slate-600">
              For onboarding assistance, pilot queries, and integration roadmap discussion.
            </p>
            <p className="text-xs font-semibold text-brand-600">partnerships@swasth360.in</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">General Inquiries</h3>
            <p className="text-xs text-slate-600">
              Platform questions, feedback on agent demonstrations, and general support.
            </p>
            <p className="text-xs font-semibold text-brand-600">hello@swasth360.in</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Desk Hours</h3>
            <p className="text-xs text-slate-600">
              Monday through Saturday: 09:30 AM to 06:30 PM IST.
            </p>
            <p className="text-xs font-semibold text-slate-700">+91 11-4567-8900</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Office Locations (India)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">Delhi Innovation Hub:</span>
              <p>Block B, Connaught Place, New Delhi 110001, India</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">Bengaluru Health-Tech Lab:</span>
              <p>Indiranagar 100 Feet Road, Bengaluru 560038, Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
