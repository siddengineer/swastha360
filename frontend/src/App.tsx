import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDemoPage } from './pages/AgentDemoPage';
import { ForHospitalsPage } from './pages/ForHospitalsPage';
import { ForIndividualsPage } from './pages/ForIndividualsPage';
import { HospitalOnboardingPage } from './pages/HospitalOnboardingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacySafetyPage } from './pages/PrivacySafetyPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { HospitalRequestsPage } from './pages/admin/HospitalRequestsPage';
import { OrganizationsPage } from './pages/admin/OrganizationsPage';
import { CreateOrgPage } from './pages/admin/CreateOrgPage';

// Hospital Pages
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { StaffManagementPage } from './pages/hospital/StaffManagementPage';
import { StaffPortalPage } from './pages/hospital/StaffPortalPage';
import { HelpdeskSettingsPage } from './pages/hospital/HelpdeskSettingsPage';

// Individual Pages
import { IndividualDashboard } from './pages/individual/IndividualDashboard';

// Hospital Role Dispatcher Component
const HospitalStaffDispatcher: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'HOSPITAL_STAFF') {
    return <StaffPortalPage />;
  }
  return <StaffManagementPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/:agentId/demo" element={<AgentDemoPage />} />
              <Route path="/for-hospitals" element={<ForHospitalsPage />} />
              <Route path="/for-individuals" element={<ForIndividualsPage />} />
              <Route path="/hospital-onboarding" element={<HospitalOnboardingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-safety" element={<PrivacySafetyPage />} />

              {/* Swasth360 Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['SWASTH360_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/hospital-requests"
                element={
                  <ProtectedRoute allowedRoles={['SWASTH360_ADMIN']}>
                    <HospitalRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/organizations"
                element={
                  <ProtectedRoute allowedRoles={['SWASTH360_ADMIN']}>
                    <OrganizationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/organizations/create"
                element={
                  <ProtectedRoute allowedRoles={['SWASTH360_ADMIN']}>
                    <CreateOrgPage />
                  </ProtectedRoute>
                }
              />

              {/* Hospital Protected Routes */}
              <Route
                path="/hospital/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN', 'HOSPITAL_STAFF']}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hospital/staff"
                element={
                  <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN', 'HOSPITAL_STAFF']}>
                    <HospitalStaffDispatcher />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hospital/helpdesk-settings"
                element={
                  <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN']}>
                    <HelpdeskSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Individual B2C Protected Routes */}
              <Route
                path="/individual/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['INDIVIDUAL_USER']}>
                    <IndividualDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
