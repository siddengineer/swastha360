import React, { useState } from 'react';
import { api } from '../services/api';
import type { HospitalOnboardingRequest } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  ShieldAlert, 
  Send, 
  Clock, 
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AVAILABLE_AGENTS_OPTIONS = [
  { id: 'patient-followup', name: 'Patient Follow-up Agent', role: 'Clinical Staff' },
  { id: 'appointment-management', name: 'Appointment Management Agent', role: 'OPD / Frontdesk' },
  { id: 'hospital-helpdesk', name: 'Hospital Helpdesk Agent', role: 'Frontdesk / Visitors' },
  { id: 'multilingual-healthcare', name: 'Multilingual Healthcare Agent', role: 'Patient Language Support' },
  { id: 'insurance-ayushman', name: 'Insurance & Ayushman Bharat Agent', role: 'TPA Desk / Helpdesk' },
  { id: 'medication-guidance', name: 'Medication Guidance Agent', role: 'Patient Education' },
  { id: 'chronic-care', name: 'Chronic Care Agent', role: 'Lifestyle OPD' },
  { id: 'maternal-child', name: 'Maternal & Child Care Agent', role: 'Pediatrics / Maternity' }
];

export const HospitalOnboardingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    orgType: 'Multispecialty Hospital',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'New Delhi',
    state: 'Delhi',
    branchesCount: 1,
    staffCount: 25,
    requestedAgents: ['patient-followup', 'appointment-management', 'hospital-helpdesk'],
    intendedUseCases: '',
    existingSoftware: '',
    additionalNotes: '',
    consentToContact: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<HospitalOnboardingRequest | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const toggleAgent = (agentId: string) => {
    setFormData(prev => {
      const exists = prev.requestedAgents.includes(agentId);
      return {
        ...prev,
        requestedAgents: exists 
          ? prev.requestedAgents.filter(id => id !== agentId)
          : [...prev.requestedAgents, agentId]
      };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.hospitalName.trim()) errs.hospitalName = 'Hospital or clinic name is required.';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Official contact person is required.';
    if (!formData.email.trim()) {
      errs.email = 'Official institutional email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
    if (formData.requestedAgents.length === 0) errs.requestedAgents = 'Please select at least one agent of interest.';
    if (!formData.consentToContact) errs.consentToContact = 'Consent to be contacted is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.onboarding.submit(formData);
      setSuccessResult(res);
    } catch (err: any) {
      setApiError(err.message || 'Failed to submit onboarding request.');
    } finally {
      setLoading(false);
    }
  };

  if (successResult) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Status: Pending Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Onboarding Request Received!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you for applying to onboard <strong>{successResult.hospitalName}</strong> onto Swasth360.
              </p>
            </div>

            {/* Request Details Box */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2.5 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-mono">
                <span className="text-slate-500">Request Identifier:</span>
                <span className="font-bold text-slate-900">#REQ-{successResult.requestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Official Contact:</span>
                <span className="font-semibold text-slate-900">{successResult.contactPerson} ({successResult.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Agents:</span>
                <span className="font-semibold text-brand-700">
                  {successResult.requestedAgents.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted Date:</span>
                <span className="text-slate-700">
                  {new Date(successResult.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 text-left flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Next Step: Swasth360 Administration Review</p>
                <p className="text-blue-700 mt-0.5">
                  This confirmation represents an onboarding request, not immediate production access. Our administrative team will review your application, verify your institution, and create your dedicated hospital organization and administrator credentials.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
              >
                Return to Homepage
              </Link>
              <Link
                to="/agents"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm"
              >
                Explore Agent Demos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Healthcare Organization Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Request Hospital Onboarding
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Submit your institution's profile to discover how specialized AI agents can support your doctors, staff, and outpatient communication.
          </p>
        </div>

        {/* PHI Warning Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Privacy Notice: Do NOT submit patient records or clinical health data</p>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              This form collects only institutional and administrative contact details. Never input patient identifiers, electronic health records (EHR), or patient health information through this onboarding portal.
            </p>
          </div>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Institution Information</h3>
            <p className="text-xs text-slate-500">Provide official details of your hospital, clinic, or network.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hospital or Clinic Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hospitalName}
                onChange={e => setFormData({ ...formData, hospitalName: e.target.value })}
                placeholder="e.g. Metro City Super Specialty Hospital"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.hospitalName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.hospitalName && <p className="text-rose-500 text-[11px] mt-1">{errors.hospitalName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Type</label>
              <select
                value={formData.orgType}
                onChange={e => setFormData({ ...formData, orgType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Multispecialty Hospital">Multispecialty Hospital</option>
                <option value="Super Specialty Hospital">Super Specialty Hospital</option>
                <option value="Community Clinic">Community Clinic / Polyclinic</option>
                <option value="Government / District Hospital">Government / District Hospital</option>
                <option value="Day Care Surgery Center">Day Care Surgery Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Approx. Staff Count</label>
              <input
                type="number"
                min={1}
                value={formData.staffCount}
                onChange={e => setFormData({ ...formData, staffCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="border-b border-slate-100 pt-4 pb-4">
            <h3 className="text-base font-bold text-slate-900">Official Contact Person</h3>
            <p className="text-xs text-slate-500">Primary point of contact for administrator account verification.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Contact Person Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Dr. Priya Nair (Medical Director)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.contactPerson ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.contactPerson && <p className="text-rose-500 text-[11px] mt-1">{errors.contactPerson}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@hospital.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765-43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="border-b border-slate-100 pt-4 pb-4">
            <h3 className="text-base font-bold text-slate-900">Agents of Interest</h3>
            <p className="text-xs text-slate-500">Select which AI agents you wish to enable for your facility.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_AGENTS_OPTIONS.map(a => {
              const isChecked = formData.requestedAgents.includes(a.id);
              return (
                <div
                  key={a.id}
                  onClick={() => toggleAgent(a.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    isChecked
                      ? 'border-brand-500 bg-brand-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 border-slate-300"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{a.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{a.role}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.requestedAgents && <p className="text-rose-500 text-[11px]">{errors.requestedAgents}</p>}

          <div className="border-b border-slate-100 pt-4 pb-4">
            <h3 className="text-base font-bold text-slate-900">Additional Context</h3>
            <p className="text-xs text-slate-500">Help our architects prepare your deployment scope.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intended Clinical or Operational Use Cases
              </label>
              <textarea
                rows={2}
                value={formData.intendedUseCases}
                onChange={e => setFormData({ ...formData, intendedUseCases: e.target.value })}
                placeholder="e.g. Automated post-op reminders for laparoscopic cholecystectomy patients, frontdesk inquiry triage..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Existing Hospital Software (HIS / EMR), if any
              </label>
              <input
                type="text"
                value={formData.existingSoftware}
                onChange={e => setFormData({ ...formData, existingSoftware: e.target.value })}
                placeholder="e.g. MedPlus, Napier, custom in-house software, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentToContact}
                onChange={e => setFormData({ ...formData, consentToContact: e.target.checked })}
                className="mt-1 w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I confirm that I am authorized to submit this onboarding inquiry on behalf of the named healthcare organization. I consent to be contacted by Swasth360 to verify our institutional credentials.
              </span>
            </label>
            {errors.consentToContact && <p className="text-rose-500 text-[11px] mt-1">{errors.consentToContact}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <span>Submitting request...</span>
              ) : (
                <>
                  <span>Submit Hospital Onboarding Request</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
