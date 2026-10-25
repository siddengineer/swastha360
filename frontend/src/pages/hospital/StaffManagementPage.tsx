import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { StaffMember } from '../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Stethoscope
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'Staff@123',
    phone: '+91 98333-00000',
    roleTitle: 'Duty Staff Nurse',
    department: 'General Ward / OPD',
    role: 'HOSPITAL_STAFF' as 'HOSPITAL_STAFF' | 'HOSPITAL_ADMIN'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = () => {
    setLoading(true);
    api.hospital.getStaff()
      .then(res => {
        setStaff(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.hospital.inviteStaff(formData);
      setModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        password: 'Staff@123',
        phone: '+91 98333-00000',
        roleTitle: 'Duty Staff Nurse',
        department: 'General Ward / OPD',
        role: 'HOSPITAL_STAFF'
      });
      fetchStaff();
    } catch (err: any) {
      setError(err.message || 'Failed to create staff account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link to="/hospital/dashboard" className="hover:text-brand-600">Hospital Dashboard</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Staff Account Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Clinical & Administrative Staff
            </h1>
            <p className="text-xs text-slate-500">
              Manage authorized healthcare personnel with access to your hospital's enabled AI agents.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Staff Member</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Staff Member</th>
                  <th className="py-3.5 px-5">Email & Credentials</th>
                  <th className="py-3.5 px-5">Role Title</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">Loading staff accounts...</td>
                  </tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">No staff accounts registered.</td>
                  </tr>
                ) : (
                  staff.map(m => (
                    <tr key={m.membershipId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                          {m.fullName.charAt(0)}
                        </div>
                        <span>{m.fullName}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600">{m.email}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800">{m.roleTitle}</td>
                      <td className="py-3.5 px-5 text-slate-500">{m.department}</td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400">
                        {new Date(m.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Staff Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-base text-slate-900">Provision Staff Account</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Staff Member Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sister Anita Mathew"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anita@hospital.demo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinical Role Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.roleTitle}
                      onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                      placeholder="e.g. Senior Staff Nurse"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. Surgery Ward 3"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Initial Password</label>
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">System Privilege Role</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="HOSPITAL_STAFF">Hospital Staff</option>
                      <option value="HOSPITAL_ADMIN">Hospital Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs disabled:opacity-50"
                  >
                    {submitting ? 'Creating Account...' : 'Provision Staff Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
