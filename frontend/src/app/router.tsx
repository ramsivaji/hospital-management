import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageTransition } from './PageTransition'
import { RequireAuth } from './RequireAuth'
import { Providers } from './providers'
import { LandingPage } from '@/features/landing/LandingPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { DoctorListPage } from '@/features/doctors/DoctorListPage'
import { DoctorDetailPage } from '@/features/doctors/DoctorDetailPage'
import { BookingPage } from '@/features/booking/BookingPage'
import { PatientDashboardPage } from '@/features/dashboard-patient/PatientDashboardPage'
import { DoctorDashboardPage } from '@/features/dashboard-doctor/DoctorDashboardPage'
import { AdminDashboardPage } from '@/features/dashboard-admin/AdminDashboardPage'
import { ShowcasePage } from '@/features/showcase/ShowcasePage'

const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <PageTransition />
      </Providers>
    ),
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/doctors', element: <DoctorListPage /> },
      { path: '/doctors/:id', element: <DoctorDetailPage /> },
      { path: '/showcase', element: <ShowcasePage /> },
      {
        element: <RequireAuth />,
        children: [{ path: '/book/:doctorId', element: <BookingPage /> }],
      },
      {
        element: <RequireAuth role="patient" />,
        children: [{ path: '/dashboard/patient', element: <PatientDashboardPage /> }],
      },
      {
        element: <RequireAuth role="doctor" />,
        children: [{ path: '/dashboard/doctor', element: <DoctorDashboardPage /> }],
      },
      {
        element: <RequireAuth role="admin" />,
        children: [{ path: '/dashboard/admin', element: <AdminDashboardPage /> }],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
