import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Menu, 
  X, 
  Building2, 
  User as UserIcon, 
  ShieldCheck, 
  Bot, 
  LogOut, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isSwasthAdmin, isHospitalAdmin, isHospitalStaff, isIndividual } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isSwasthAdmin) return '/admin/dashboard';
    if (isHospitalAdmin) return '/hospital/dashboard';
    if (isHospitalStaff) return '/hospital/staff';
    if (isIndividual) return '/individual/dashboard';
    return '/login';
  };

  const getDashboardLabel = () => {
    if (isSwasthAdmin) return 'Platform Admin';
    if (isHospitalAdmin) return 'Hospital Portal';
    if (isHospitalStaff) return 'Staff Portal';
    if (isIndividual) return 'My Health Portal';
    return 'Dashboard';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Swasth<span className="text-brand-600">360</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">India</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">AI Agents for Smarter Healthcare</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/agents" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/agents') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              AI Agents
            </Link>
            <Link 
              to="/for-hospitals" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/for-hospitals') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              For Hospitals
            </Link>
            <Link 
              to="/for-individuals" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/for-individuals') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              For Individuals
            </Link>
            <Link 
              to="/hospital-onboarding" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/hospital-onboarding') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Onboard Hospital
            </Link>
            <Link 
              to="/privacy-safety" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/privacy-safety') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Safety & Ethics
            </Link>
          </nav>

          {/* User Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 text-sm font-semibold border border-brand-200 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{getDashboardLabel()}</span>
                </Link>
                <div className="text-right pl-1">
                  <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">{user.fullName}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                    {user.organizationName || user.role.replace('_', ' ')}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-600/30 transition-all"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/agents"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            AI Agents (9)
          </Link>
          <Link
            to="/for-hospitals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            For Hospitals (B2B)
          </Link>
          <Link
            to="/for-individuals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            For Individuals (B2C)
          </Link>
          <Link
            to="/hospital-onboarding"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Hospital Onboarding Request
          </Link>
          <Link
            to="/privacy-safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Safety & Ethics
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-brand-600 text-white font-semibold text-sm"
                >
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-brand-600 text-white font-semibold text-sm"
                >
                  Create Individual Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
