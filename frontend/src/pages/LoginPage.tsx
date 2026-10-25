import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Activity, 
  Lock, 
  Mail, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  User, 
  Sparkles,
  Stethoscope
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      login(res.token, {
        id: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
        organizationId: res.organizationId,
        organizationName: res.organizationName,
        organizationSlug: res.organizationSlug,
        active: true,
      });

      // Role-based redirect
      if (res.role === 'SWASTH360_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.role === 'HOSPITAL_ADMIN') {
        navigate('/hospital/dashboard');
      } else if (res.role === 'HOSPITAL_STAFF') {
        navigate('/hospital/staff');
      } else {
        navigate('/individual/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">Swasth<span className="text-brand-600">360</span></span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900">Sign in to your account</h2>
        <p className="text-xs text-slate-500">Access specialized healthcare AI portals and agents</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@hospital.com or user@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-all mt-2"
            >
              {loading ? <span>Authenticating...</span> : <span>Sign In</span>}
            </button>
          </form>

          {/* Demo Quick-Fill Buttons */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Demonstration Quick-Fill Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@swasth360.in', 'Admin@123')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Platform Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">admin@swasth360.in</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('hospitaladmin@abchealthcare.demo', 'Hospital@123')}
                className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 transition-colors"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hospital Admin</span>
                </div>
                <div className="text-[10px] text-blue-600/80 mt-0.5 truncate">ABC Healthcare</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff@abchealthcare.demo', 'Staff@123')}
                className="p-2.5 rounded-xl bg-teal-50/60 hover:bg-teal-100/60 border border-teal-200 transition-colors"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-900">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hospital Staff</span>
                </div>
                <div className="text-[10px] text-teal-600/80 mt-0.5 truncate">Sister Sunita</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('rahul.sharma@example.com', 'User@123')}
                className="p-2.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200 transition-colors"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Individual (B2C)</span>
                </div>
                <div className="text-[10px] text-emerald-600/80 mt-0.5 truncate">Rahul Sharma</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have an individual account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
