import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, PhoneCall, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Safety Disclaimer Banner */}
        <div className="mb-12 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start space-x-3 text-sm text-slate-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Important Medical & Platform Safety Notice</p>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              Swasth360 is an AI-assisted healthcare platform. It does not replace qualified healthcare professionals or provide emergency medical services.
              Swasth360 is NOT a hospital directory or discovery search engine; hospitals are distinct organizations that onboard onto our specialized AI platform.
              In case of medical emergency, immediately contact <strong className="text-white">112 / 108</strong> in India, or <strong className="text-white">Tele-MANAS (14416)</strong> for crisis support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">Swasth<span className="text-brand-400">360</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specialized AI Agents for Smarter Healthcare in India. Empowering hospitals, clinical teams, and individuals through safe, role-based workflows.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-brand-400" />
              <span>National Support Desk: support@swasth360.in</span>
            </div>
          </div>

          {/* Platform AI Agents */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Specialized Agents</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/agents" className="hover:text-white transition-colors">Patient Follow-up Agent</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Medication Guidance Agent</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Appointment Management Agent</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Chronic Care Agent</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Hospital Helpdesk Agent</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Multilingual Indic Healthcare Agent</Link></li>
            </ul>
          </div>

          {/* Solutions & Access */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/for-hospitals" className="hover:text-white transition-colors">For Hospitals & Clinics (B2B)</Link></li>
              <li><Link to="/hospital-onboarding" className="hover:text-white transition-colors">Hospital Onboarding Request</Link></li>
              <li><Link to="/for-individuals" className="hover:text-white transition-colors">For Individuals & Families (B2C)</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Hospital Staff Portal</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Personal Account</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Ethics & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy-safety" className="hover:text-white transition-colors">Clinical Safety & Non-Diagnosis Policy</Link></li>
              <li><Link to="/privacy-safety" className="hover:text-white transition-colors">Data Privacy & Tenancy Isolation</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Swasth360 Administration</Link></li>
              <li><span className="text-slate-500">Ayushman Bharat PM-JAY Navigational Support</span></li>
              <li><span className="text-slate-500">Tele-MANAS Emergency Escalation Protocol</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Swasth360 India. Demonstration Prototype for Academic & Healthcare Innovation.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Built with Spring Boot 3 + Python FastAPI + React TS</span>
            <span>•</span>
            <span className="text-brand-400 font-semibold">Demo Mode Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
