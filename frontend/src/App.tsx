import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Placeholder page components
const Landing = () => <div>Landing Page</div>
const Login = () => <div>Login Page</div>
const Register = () => <div>Register Page</div>
const Doctors = () => <div>Doctors Page</div>
const DashboardPatient = () => <div>Patient Dashboard</div>
const DashboardDoctor = () => <div>Doctor Dashboard</div>
const DashboardAdmin = () => <div>Admin Dashboard</div>
const NotFound = () => <div>404 — Page Not Found</div>

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/dashboard/patient" element={<DashboardPatient />} />
        <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
