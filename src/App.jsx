import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useStore } from './store';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import { PatientDashboard, DoctorDirectory, BookingPage, PatientAppointments, PatientPrescriptions, PatientFollowups, PatientProfile } from './pages/PatientPages';
import { DoctorDashboard, DoctorAppointments, DoctorPatients, DoctorPrescriptions, DoctorFollowups, DoctorProfile } from './pages/DoctorPages';
import { PortalLayout } from './components';

function RequireRole({ role, children }) {
  const { session } = useStore();
  const location = useLocation();
  if (!session || session.role !== role) return <Navigate to={`/login/${role}`} replace state={{ from: location.pathname }} />;
  return <PortalLayout role={role}>{children}</PortalLayout>;
}

export default function App() {
  const { session } = useStore();
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login/:role" element={<AuthPage />} />
    <Route path="/patient" element={<RequireRole role="patient"><PatientDashboard /></RequireRole>} />
    <Route path="/patient/doctors" element={<RequireRole role="patient"><DoctorDirectory /></RequireRole>} />
    <Route path="/patient/book" element={<RequireRole role="patient"><BookingPage /></RequireRole>} />
    <Route path="/patient/appointments" element={<RequireRole role="patient"><PatientAppointments /></RequireRole>} />
    <Route path="/patient/prescriptions" element={<RequireRole role="patient"><PatientPrescriptions /></RequireRole>} />
    <Route path="/patient/follow-ups" element={<RequireRole role="patient"><PatientFollowups /></RequireRole>} />
    <Route path="/patient/profile" element={<RequireRole role="patient"><PatientProfile /></RequireRole>} />
    <Route path="/doctor" element={<RequireRole role="doctor"><DoctorDashboard /></RequireRole>} />
    <Route path="/doctor/today" element={<RequireRole role="doctor"><DoctorAppointments today /></RequireRole>} />
    <Route path="/doctor/appointments" element={<RequireRole role="doctor"><DoctorAppointments /></RequireRole>} />
    <Route path="/doctor/patients" element={<RequireRole role="doctor"><DoctorPatients /></RequireRole>} />
    <Route path="/doctor/prescriptions" element={<RequireRole role="doctor"><DoctorPrescriptions /></RequireRole>} />
    <Route path="/doctor/follow-ups" element={<RequireRole role="doctor"><DoctorFollowups /></RequireRole>} />
    <Route path="/doctor/profile" element={<RequireRole role="doctor"><DoctorProfile /></RequireRole>} />
    <Route path="*" element={<Navigate to={session ? `/${session.role}` : '/'} replace />} />
  </Routes>;
}
