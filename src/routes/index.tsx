import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../features/public/pages/LandingPage';
import BookAppointmentPage from '../features/public/pages/BookAppointmentPage';
import AppointmentSuccessPage from '../features/public/pages/AppointmentSuccessPage';
import ServicesPage from '../features/public/pages/ServicesPage';
import DoctorsPage from '../features/public/pages/DoctorsPage';
import Login from '../pages/auth/Login';
import OverviewPage from '../pages/dashboard/OverviewPage';
import PatientsPage from '../pages/dashboard/PatientsPage';
import PatientProfile from '../pages/dashboard/PatientProfile';
import ConsultationScreen from '../pages/dashboard/ConsultationScreen';
import AppointmentsPage from '../pages/dashboard/AppointmentsPage';
import InvoicesPage from '../pages/dashboard/InvoicesPage';
import EmployeesPage from '../pages/dashboard/EmployeesPage';
import AppointmentBoard from '../pages/dashboard/AppointmentBoard';
import VisitsPage from '../pages/dashboard/VisitsPage';
import QueueDashboardPage from '../pages/dashboard/QueueDashboardPage';
import PublicCheckinPage from '../features/public/pages/PublicCheckinPage';
import WaitingScreenPage from '../features/public/pages/WaitingScreenPage';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const RoleBasedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const user = useAuthStore(state => state.user);
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect based on role if logged in but unauthorized for this specific route
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (user?.role === 'receptionist') return <Navigate to="/reception/dashboard" replace />;
    if (user?.role === 'patient') return <Navigate to="/patient-portal" replace />;
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/book-appointment" element={<BookAppointmentPage />} />
        <Route path="/appointment-success" element={<AppointmentSuccessPage />} />
        <Route path="/checkin/:token" element={<PublicCheckinPage />} />
        <Route path="/waiting-screen" element={<WaitingScreenPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><RoleBasedRoute allowedRoles={['admin']}><DashboardLayout /></RoleBasedRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OverviewPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="doctors" element={<EmployeesPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointment-board" element={<AppointmentBoard />} />
        <Route path="queue" element={<QueueDashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="visits" element={<VisitsPage />} />
        <Route path="staff" element={<EmployeesPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={<ProtectedRoute><RoleBasedRoute allowedRoles={['doctor']}><DashboardLayout /></RoleBasedRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointment-board" element={<AppointmentBoard />} />
        <Route path="queue" element={<QueueDashboardPage />} />
        <Route path="consultations" element={<VisitsPage />} />
        <Route path="visits/:id?" element={<ConsultationScreen />} />
      </Route>

      {/* Receptionist Routes */}
      <Route path="/reception" element={<ProtectedRoute><RoleBasedRoute allowedRoles={['receptionist']}><DashboardLayout /></RoleBasedRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointment-board" element={<AppointmentBoard />} />
        <Route path="queue" element={<QueueDashboardPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Route>

      {/* Patient Portal */}
      <Route path="/patient-portal" element={<ProtectedRoute><RoleBasedRoute allowedRoles={['patient']}><DashboardLayout /></RoleBasedRoute></ProtectedRoute>}>
        <Route path="" element={<PatientProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
