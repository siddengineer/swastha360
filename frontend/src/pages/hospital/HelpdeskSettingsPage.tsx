import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { HelpdeskSettings } from '../../types';
import { 
  Settings, 
  Save, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Clock,
  FileText,
  Phone,
  Mail
} from 'lucide-react';

export const HelpdeskSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<HelpdeskSettings>({
    visitingHours: '',
    appointmentInstructions: '',
    contactPhone: '',
    contactEmail: '',
    generalFaq: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.hospital.getHelpdeskSettings()
      .then(res => {
        setSettings(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load helpdesk settings.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await api.hospital.updateHelpdeskSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update helpdesk settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link to="/hospital/dashboard" className="hover:text-brand-600">Hospital Dashboard</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Helpdesk Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Helpdesk Demonstration Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure institution-specific rules that the Hospital Helpdesk Agent utilizes in its responses.
            </p>
          </div>
        </div>

        {/* Live Linking Notice Banner */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Live AI Context Integration</p>
            <p className="text-teal-800 mt-0.5 leading-relaxed">
              When authorized staff or patients invoke the <strong>Hospital Helpdesk Agent</strong>, our AI orchestration engine automatically passes these custom settings into the agent's context. Changes saved here immediately update the AI agent's responses!
            </p>
          </div>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Helpdesk configuration saved successfully! Hospital Helpdesk Agent updated.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading hospital helpdesk settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Hospital Visiting Hours *</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.visitingHours}
                  onChange={e => setSettings({ ...settings, visitingHours: e.target.value })}
                  placeholder="e.g. General: 5:00 PM – 7:00 PM Daily | ICU: 11:00 AM – 12:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Used when users ask about visitation schedules or ICU passes.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  <span>OPD Appointment & Admission Instructions *</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={settings.appointmentInstructions}
                  onChange={e => setSettings({ ...settings, appointmentInstructions: e.target.value })}
                  placeholder="e.g. Please report 20 minutes prior to your slot at OPD Counter 2 with Photo ID..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Used when users ask about registration queues or required paperwork.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    <span>Hospital Helpdesk Phone *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.contactPhone}
                    onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-600" />
                    <span>Helpdesk Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                  <span>Facility FAQs & Specialized Instructions</span>
                </label>
                <textarea
                  rows={4}
                  value={settings.generalFaq}
                  onChange={e => setSettings({ ...settings, generalFaq: e.target.value })}
                  placeholder="Q: Where is the pharmacy located? A: Ground floor near Gate 1..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <Link
                to="/hospital/dashboard"
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Helpdesk Configuration'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
