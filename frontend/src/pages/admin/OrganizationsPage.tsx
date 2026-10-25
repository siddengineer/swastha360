import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { OrganizationSummary, OrganizationDetail, OrgStatus } from '../../types';
import { 
  Building2, 
  Layers, 
  Plus, 
  Settings, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Power, 
  Users,
  Search,
  ExternalLink
} from 'lucide-react';

const ALL_AGENTS_LIST = [
  { id: 'patient-followup', name: 'Patient Follow-up Agent' },
  { id: 'medication-guidance', name: 'Medication Guidance Agent' },
  { id: 'appointment-management', name: 'Appointment Management Agent' },
  { id: 'chronic-care', name: 'Chronic Care Agent' },
  { id: 'maternal-child', name: 'Maternal & Child Care Agent' },
  { id: 'insurance-ayushman', name: 'Insurance & Ayushman Bharat Agent' },
  { id: 'hospital-helpdesk', name: 'Hospital Helpdesk Agent' },
  { id: 'mental-wellness', name: 'Mental Wellness Check-in Agent' },
  { id: 'multilingual-healthcare', name: 'Multilingual Healthcare Agent' }
];

export const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrgDetail, setSelectedOrgDetail] = useState<OrganizationDetail | null>(null);
  const [editingAgentsOrg, setEditingAgentsOrg] = useState<OrganizationDetail | null>(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [savingAgents, setSavingAgents] = useState(false);

  const fetchOrganizations = () => {
    setLoading(true);
    api.admin.getOrganizations()
      .then(data => {
        setOrganizations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenAgentManager = async (orgSummary: OrganizationSummary) => {
    try {
      const detail = await api.admin.getOrganizationById(orgSummary.id);
      setEditingAgentsOrg(detail);
      setSelectedAgentIds(detail.enabledAgentIds);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch details');
    }
  };

  const handleToggleOrgStatus = async (org: OrganizationSummary) => {
    const nextStatus: OrgStatus = org.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change ${org.name} to ${nextStatus}?`)) return;

    try {
      await api.admin.updateOrgStatus(org.id, nextStatus);
      fetchOrganizations();
    } catch (err: any) {
      alert(err.message || 'Status toggle failed');
    }
  };

  const handleSaveAgents = async () => {
    if (!editingAgentsOrg) return;
    setSavingAgents(true);
    try {
      await api.admin.updateOrgAgents(editingAgentsOrg.id, selectedAgentIds);
      setEditingAgentsOrg(null);
      fetchOrganizations();
    } catch (err: any) {
      alert(err.message || 'Agent update failed');
    } finally {
      setSavingAgents(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgentIds(prev => 
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const filtered = organizations.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase()) ||
    o.uniqueSlug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link to="/admin/dashboard" className="hover:text-brand-600">Admin</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Organizations Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Tenant Organizations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage active facilities, configure agent authorizations, and enforce organization suspension.
            </p>
          </div>

          <Link
            to="/admin/organizations/create"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Organization</span>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by hospital name or slug..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Organizations Registered
          </span>
        </div>

        {/* Organizations Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(n => <div key={n} className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>)
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              No hospital organizations found.
            </div>
          ) : (
            filtered.map(org => (
              <div
                key={org.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      org.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {org.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: #{org.id}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">{org.name}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">/{org.uniqueSlug}</p>
                    <p className="text-xs text-slate-500 mt-1">{org.type} • {org.city}, {org.state}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Enabled Agents</span>
                      <strong className="text-brand-700 text-sm">{org.enabledAgentsCount} Activated</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Staff Accounts</span>
                      <span className="font-semibold text-slate-800">~{org.staffCount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenAgentManager(org)}
                    className="flex-1 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1"
                  >
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    <span>Manage Agents</span>
                  </button>

                  <button
                    onClick={() => handleToggleOrgStatus(org)}
                    title={org.status === 'ACTIVE' ? 'Suspend Organization' : 'Reactivate Organization'}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors ${
                      org.status === 'ACTIVE'
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Manage Agents Modal */}
        {editingAgentsOrg && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Authorize Agents for {editingAgentsOrg.name}</h3>
                  <p className="text-xs text-slate-500">Toggle enabled status for this tenant</p>
                </div>
                <button
                  onClick={() => setEditingAgentsOrg(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {ALL_AGENTS_LIST.map(ag => {
                  const isEnabled = selectedAgentIds.includes(ag.id);
                  return (
                    <div
                      key={ag.id}
                      onClick={() => toggleAgent(ag.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isEnabled
                          ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-xs font-semibold">{ag.name}</span>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => {}}
                        className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setEditingAgentsOrg(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAgents}
                  disabled={savingAgents}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold disabled:opacity-50"
                >
                  {savingAgents ? 'Saving Changes...' : 'Save Agent Assignments'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
