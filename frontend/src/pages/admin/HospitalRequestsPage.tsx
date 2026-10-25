import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { HospitalOnboardingRequest, RequestStatus } from '../../types';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Eye, 
  Filter, 
  Search,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const HospitalRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<HospitalOnboardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReq, setSelectedReq] = useState<HospitalOnboardingRequest | null>(null);
  const [rejectionModalReq, setRejectionModalReq] = useState<HospitalOnboardingRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchRequests = () => {
    setLoading(true);
    api.admin.getRequests()
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: number, status: RequestStatus, reason?: string) => {
    setProcessingId(id);
    try {
      await api.admin.updateRequestStatus(id, status, reason);
      fetchRequests();
      if (rejectionModalReq) setRejectionModalReq(null);
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link to="/admin/dashboard" className="hover:text-brand-600">Admin Dashboard</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Hospital Onboarding Requests</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Onboarding Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review institutional verification submissions and authorize facility provisioning.
            </p>
          </div>

          <Link
            to="/admin/organizations/create"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1"
          >
            <span>Direct Create Organization</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Status Filter:</span>
            {['ALL', 'PENDING_REVIEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Requests' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredRequests.length} of {requests.length}
          </span>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Hospital / Clinic</th>
                  <th className="py-3.5 px-4">Official Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Requested Agents</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">Loading requests...</td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">No requests match this filter.</td>
                  </tr>
                ) : (
                  filteredRequests.map(req => (
                    <tr key={req.requestId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #REQ-{req.requestId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{req.hospitalName}</div>
                        <div className="text-[10px] text-slate-400">{req.orgType}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{req.contactPerson}</div>
                        <div className="text-[10px] text-slate-400">{req.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {req.city}, {req.state}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {req.requestedAgents.map(ag => (
                            <span key={ag} className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] border border-brand-200 font-mono">
                              {ag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' :
                          req.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedReq(req)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {req.status === 'PENDING_REVIEW' && (
                          <button
                            onClick={() => handleUpdateStatus(req.requestId, 'UNDER_REVIEW')}
                            disabled={processingId === req.requestId}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            Mark Review
                          </button>
                        )}

                        {(req.status === 'PENDING_REVIEW' || req.status === 'UNDER_REVIEW') && (
                          <>
                            <button
                              onClick={() => {
                                navigate(`/admin/organizations/create?requestId=${req.requestId}&name=${encodeURIComponent(req.hospitalName)}&email=${encodeURIComponent(req.email)}&contact=${encodeURIComponent(req.contactPerson)}&city=${encodeURIComponent(req.city)}&state=${encodeURIComponent(req.state)}&agents=${req.requestedAgents.join(',')}`);
                              }}
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              Approve & Provision
                            </button>
                            <button
                              onClick={() => setRejectionModalReq(req)}
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {req.status === 'APPROVED' && (
                          <Link
                            to={`/admin/organizations/create?requestId=${req.requestId}&name=${encodeURIComponent(req.hospitalName)}&email=${encodeURIComponent(req.email)}&contact=${encodeURIComponent(req.contactPerson)}&city=${encodeURIComponent(req.city)}&state=${encodeURIComponent(req.state)}&agents=${req.requestedAgents.join(',')}`}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                          >
                            Provision Tenant
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Modal */}
        {selectedReq && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-base text-slate-900">Application Details: #{selectedReq.requestId}</h3>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Organization Name:</span>
                    <strong className="text-slate-900 text-sm">{selectedReq.hospitalName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Type:</span>
                    <span className="font-medium text-slate-900">{selectedReq.orgType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Official:</span>
                    <span className="font-medium text-slate-900">{selectedReq.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Official Email:</span>
                    <span className="font-mono text-slate-900">{selectedReq.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <span className="text-slate-900">{selectedReq.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Branches / Staff:</span>
                    <span className="text-slate-900">{selectedReq.branchesCount} branch(es) • ~{selectedReq.staffCount} staff</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Requested AI Agents:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedReq.requestedAgents.map(ag => (
                      <span key={ag} className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 font-mono text-[11px]">
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedReq.intendedUseCases && (
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Intended Use Cases:</span>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">{selectedReq.intendedUseCases}</p>
                  </div>
                )}

                {selectedReq.existingSoftware && (
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Current Hospital Software:</span>
                    <p className="bg-slate-50 p-2 rounded-lg border border-slate-200">{selectedReq.existingSoftware}</p>
                  </div>
                )}

                {selectedReq.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="font-bold block">Rejection Reason:</span>
                    <p className="mt-0.5">{selectedReq.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {rejectionModalReq && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-base">
                <XCircle className="w-5 h-5" />
                <h3>Reject Onboarding Request</h3>
              </div>
              <p className="text-xs text-slate-600">
                Specify a rejection justification for <strong>{rejectionModalReq.hospitalName}</strong> (#REQ-{rejectionModalReq.requestId}):
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete institutional accreditation documentation..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setRejectionModalReq(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(rejectionModalReq.requestId, 'REJECTED', rejectionReason)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
