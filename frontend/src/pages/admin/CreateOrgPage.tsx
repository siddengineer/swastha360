import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Building2, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Mail, 
  User, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const ALL_AVAILABLE_AGENTS = [
  { id: 'patient-followup', name: 'Patient Follow-up Agent', defaultCheck: true },
  { id: 'appointment-management', name: 'Appointment Management Agent', defaultCheck: true },
  { id: 'hospital-helpdesk', name: 'Hospital Helpdesk Agent', defaultCheck: true },
  { id: 'multilingual-healthcare', name: 'Multilingual Healthcare Agent', defaultCheck: false },
  { id: 'insurance-ayushman', name: 'Insurance & Ayushman Bharat Agent', defaultCheck: false },
  { id: 'medication-guidance', name: 'Medication Guidance Agent', defaultCheck: false },
  { id: 'chronic-care', name: 'Chronic Care Agent', defaultCheck: false },
  { id: 'maternal-child', name: 'Maternal & Child Care Agent', defaultCheck: false },
  { id: 'mental-wellness', name: 'Mental Wellness Check-in Agent', defaultCheck: false }
];

export const CreateOrgPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestIdParam = searchParams.get('requestId');
  const nameParam = searchParams.get('name') || '';
  const emailParam = searchParams.get('email') || '';
  const contactParam = searchParams.get('contact') || '';
  const cityParam = searchParams.get('city') || 'New Delhi';
  const stateParam = searchParams.get('state') || 'Delhi';
  const agentsParam = searchParams.get('agents');

  const [formData, setFormData] = useState({
    requestId: requestIdParam ? parseInt(requestIdParam) : undefined,
    name: nameParam,
    uniqueSlug: '',
    orgType: 'Multispecialty Hospital',
    city: cityParam,
    state: stateParam,
    enabledAgentIds: agentsParam ? agentsParam.split(',') : ['patient-followup', 'appointment-management', 'hospital-helpdesk'],
    adminFullName: contactParam || 'Hospital Administrator',
    adminEmail: emailParam,
    adminPassword: 'Hospital@123',
    adminPhone: '+91 98111-22333',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name if empty
  useEffect(() => {
    if (formData.name && !formData.uniqueSlug) {
      const generated = formData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, uniqueSlug: generated }));
    }
  }, [formData.name]);

  const toggleAgent = (agentId: string) => {
    setFormData(prev => {
      const exists = prev.enabledAgentIds.includes(agentId);
      return {
        ...prev,
        enabledAgentIds: exists 
          ? prev.enabledAgentIds.filter(id => id !== agentId)
          : [...prev.enabledAgentIds, agentId]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.admin.createOrganization(formData);
      navigate('/admin/organizations');
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <Link to="/admin/dashboard" className="hover:text-brand-600">Admin</Link>
          <span>/</span>
          <Link to="/admin/organizations" className="hover:text-brand-600">Organizations</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Create & Provision</span>
        </div>

        <div className="text-left space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Provision Hospital Organization Tenant
          </h1>
          <p className="text-xs text-slate-500">
            Allocate specialized AI agents and provision initial hospital administrator access.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          {formData.requestId && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <span>Linking with Onboarding Request: <strong>#REQ-{formData.requestId}</strong></span>
              <span className="text-[10px] uppercase font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Verified</span>
            </div>
          )}

          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Hospital Organization Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Apex Multispecialty Hospital"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unique Slug Identifier *</label>
              <input
                type="text"
                required
                value={formData.uniqueSlug}
                onChange={e => setFormData({ ...formData, uniqueSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="apex-hospital-delhi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Type</label>
              <select
                value={formData.orgType}
                onChange={e => setFormData({ ...formData, orgType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Multispecialty Hospital">Multispecialty Hospital</option>
                <option value="Super Specialty Hospital">Super Specialty Hospital</option>
                <option value="Clinic">Clinic / Polyclinic</option>
                <option value="Day Care Center">Day Care Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Enabled Agents Selection */}
          <div className="border-b border-slate-100 pt-4 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Authorize Enabled AI Agents for this Tenant</h3>
            <p className="text-xs text-slate-500">Only authorized agents will be accessible in this hospital's dashboard.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALL_AVAILABLE_AGENTS.map(agent => {
              const isChecked = formData.enabledAgentIds.includes(agent.id);
              return (
                <div
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{agent.name}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500"
                  />
                </div>
              );
            })}
          </div>

          {/* Hospital Administrator Account */}
          <div className="border-b border-slate-100 pt-4 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Initial Hospital Administrator Account</h3>
            <p className="text-xs text-slate-500">This user will receive HOSPITAL_ADMIN role scoped exclusively to this facility.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Full Name *</label>
              <input
                type="text"
                required
                value={formData.adminFullName}
                onChange={e => setFormData({ ...formData, adminFullName: e.target.value })}
                placeholder="e.g. Dr. Ramesh Gupta"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email (Login) *</label>
              <input
                type="email"
                required
                value={formData.adminEmail}
                onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="admin@hospital.demo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password *</label>
              <input
                type="text"
                required
                value={formData.adminPassword}
                onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.adminPhone}
                onChange={e => setFormData({ ...formData, adminPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <Link
              to="/admin/organizations"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
            >
              <span>Provision Organization & Activate Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
