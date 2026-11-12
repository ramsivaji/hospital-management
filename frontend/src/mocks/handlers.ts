import { http, HttpResponse } from 'msw'

// Mock Data
export const mockSpecialties = [
  { id: 1, name: 'General Practice', slug: 'general-practice' },
  { id: 2, name: 'Cardiology', slug: 'cardiology' },
  { id: 3, name: 'Dermatology', slug: 'dermatology' },
  { id: 4, name: 'Pediatrics', slug: 'pediatrics' },
  { id: 5, name: 'Orthopedics', slug: 'orthopedics' },
  { id: 6, name: 'Neurology', slug: 'neurology' },
]

export const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@clinic.com',
    specialty: 'General Practice',
    specialty_slug: 'general-practice',
    bio: 'Board-certified family physician with 12 years of experience providing compassionate, comprehensive primary care for all ages.',
    avatar_url: '',
    slot_minutes: 30,
    buffer_minutes: 5,
    rating: 4.9,
    review_count: 142,
    availability_preview: ['Mon: 09:00 - 17:00', 'Wed: 09:00 - 17:00', 'Fri: 09:00 - 15:00'],
  },
  {
    id: 2,
    name: 'Dr. James Wilson',
    email: 'james.wilson@clinic.com',
    specialty: 'Cardiology',
    specialty_slug: 'cardiology',
    bio: 'Specialist in non-invasive cardiology, preventive heart care, hypertension management, and echocardiography.',
    avatar_url: '',
    slot_minutes: 45,
    buffer_minutes: 10,
    rating: 4.8,
    review_count: 98,
    availability_preview: ['Tue: 08:30 - 16:30', 'Thu: 08:30 - 16:30'],
  },
  {
    id: 3,
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@clinic.com',
    specialty: 'Dermatology',
    specialty_slug: 'dermatology',
    bio: 'Expert in clinical dermatology, skin cancer screenings, acne treatments, and minimally invasive laser therapies.',
    avatar_url: '',
    slot_minutes: 30,
    buffer_minutes: 5,
    rating: 4.95,
    review_count: 210,
    availability_preview: ['Mon: 10:00 - 18:00', 'Tue: 10:00 - 18:00', 'Thu: 10:00 - 18:00'],
  },
  {
    id: 4,
    name: 'Dr. Marcus Chen',
    email: 'marcus.chen@clinic.com',
    specialty: 'Pediatrics',
    specialty_slug: 'pediatrics',
    bio: 'Dedicated pediatrician focused on developmental milestones, newborn care, preventive vaccinations, and childhood wellness.',
    avatar_url: '',
    slot_minutes: 30,
    buffer_minutes: 5,
    rating: 4.9,
    review_count: 175,
    availability_preview: ['Mon - Fri: 09:00 - 16:00'],
  },
  {
    id: 5,
    name: 'Dr. Priya Patel',
    email: 'priya.patel@clinic.com',
    specialty: 'Orthopedics',
    specialty_slug: 'orthopedics',
    bio: 'Specializing in sports injuries, joint preservation, knee and shoulder arthroscopy, and post-injury rehabilitation.',
    avatar_url: '',
    slot_minutes: 45,
    buffer_minutes: 10,
    rating: 4.85,
    review_count: 89,
    availability_preview: ['Wed: 08:00 - 17:00', 'Fri: 08:00 - 16:00'],
  },
  {
    id: 6,
    name: 'Dr. David Kim',
    email: 'david.kim@clinic.com',
    specialty: 'Neurology',
    specialty_slug: 'neurology',
    bio: 'Expert clinical neurologist diagnosing and managing chronic migraines, neuropathy, tremors, and cognitive disorders.',
    avatar_url: '',
    slot_minutes: 60,
    buffer_minutes: 15,
    rating: 4.75,
    review_count: 64,
    availability_preview: ['Tue: 09:00 - 15:00', 'Thu: 09:00 - 15:00'],
  },
]

export function generateMockSlots(dateStr: string) {
  const times = [
    '09:00',
    '09:45',
    '10:30',
    '11:15',
    '13:30',
    '14:15',
    '15:00',
    '16:00',
  ]
  return times.map((t) => ({
    start: `${dateStr}T${t}:00`,
    end: `${dateStr}T${t}:30`,
  }))
}

let mockAppointments = [
  {
    id: 101,
    doctor_id: 1,
    doctor_name: 'Dr. Sarah Mitchell',
    doctor_specialty: 'General Practice',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T10:00:00',
    end_at: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T10:30:00',
    status: 'confirmed' as const,
    reason: 'Annual health checkup',
    notes: 'Patient requested blood panel review.',
  },
  {
    id: 102,
    doctor_id: 2,
    doctor_name: 'Dr. James Wilson',
    doctor_specialty: 'Cardiology',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] + 'T14:15:00',
    end_at: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] + 'T15:00:00',
    status: 'pending' as const,
    reason: 'Routine ECG follow-up',
    notes: '',
  },
  {
    id: 103,
    doctor_id: 3,
    doctor_name: 'Dr. Elena Rostova',
    doctor_specialty: 'Dermatology',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0] + 'T11:00:00',
    end_at: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0] + 'T11:30:00',
    status: 'confirmed' as const,
    reason: 'Skin allergy consultation',
    notes: '',
  },
  {
    id: 91,
    doctor_id: 1,
    doctor_name: 'Dr. Sarah Mitchell',
    doctor_specialty: 'General Practice',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: '2026-10-15T09:30:00',
    end_at: '2026-10-15T10:00:00',
    status: 'completed' as const,
    reason: 'Flu symptoms and vaccination',
    notes: 'Prescribed rest and hydration.',
  },
  {
    id: 92,
    doctor_id: 4,
    doctor_name: 'Dr. Marcus Chen',
    doctor_specialty: 'Pediatrics',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: '2026-09-20T11:00:00',
    end_at: '2026-09-20T11:30:00',
    status: 'completed' as const,
    reason: 'Child immunization booster',
    notes: 'All standard immunizations updated.',
  },
  {
    id: 93,
    doctor_id: 5,
    doctor_name: 'Dr. Priya Patel',
    doctor_specialty: 'Orthopedics',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: '2026-08-05T15:00:00',
    end_at: '2026-08-05T15:45:00',
    status: 'cancelled' as const,
    reason: 'Ankle sprain exam',
    notes: 'Cancelled by patient.',
  },
  {
    id: 94,
    doctor_id: 2,
    doctor_name: 'Dr. James Wilson',
    doctor_specialty: 'Cardiology',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: '2026-07-12T14:00:00',
    end_at: '2026-07-12T14:45:00',
    status: 'completed' as const,
    reason: 'Blood pressure check',
    notes: 'BP stabilized at 120/80.',
  },
  {
    id: 95,
    doctor_id: 3,
    doctor_name: 'Dr. Elena Rostova',
    doctor_specialty: 'Dermatology',
    patient_id: 1,
    patient_name: 'Alex Johnson',
    patient_email: 'alex.johnson@example.com',
    start_at: '2026-06-18T10:30:00',
    end_at: '2026-06-18T11:00:00',
    status: 'no-show' as const,
    reason: 'Mole evaluation',
    notes: 'Patient did not arrive.',
  },
]

export const handlers = [
  // Healthcheck
  http.get('*/healthz', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // Auth: Login
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email || 'patient@example.com'
    let role = 'patient'
    let name = 'Alex Johnson'

    if (email.includes('doctor')) {
      role = 'doctor'
      name = 'Dr. Sarah Mitchell'
    } else if (email.includes('admin')) {
      role = 'admin'
      name = 'Clinic Administrator'
    }

    return HttpResponse.json({
      access: 'mock-jwt-access-token-12345',
      user: {
        id: role === 'doctor' ? 1 : 42,
        email,
        name,
        role,
        is_active: true,
      },
    })
  }),

  // Auth: Register
  http.post('*/api/v1/auth/register', async ({ request }) => {
    const body = (await request.json()) as { name?: string; email?: string; role?: string }
    return HttpResponse.json(
      {
        access: 'mock-jwt-access-token-newuser',
        user: {
          id: 99,
          email: body.email || 'new@example.com',
          name: body.name || 'New User',
          role: body.role || 'patient',
          is_active: true,
        },
      },
      { status: 201 },
    )
  }),

  // Auth: Refresh
  http.post('*/api/v1/auth/refresh', () => {
    return HttpResponse.json({
      access: 'mock-jwt-access-token-refreshed',
    })
  }),

  // Auth: Logout
  http.post('*/api/v1/auth/logout', () => {
    return HttpResponse.json({ message: 'Successfully logged out' })
  }),

  // Auth: Me
  http.get('*/api/v1/auth/me', () => {
    return HttpResponse.json({
      id: 42,
      email: 'alex.johnson@example.com',
      name: 'Alex Johnson',
      role: 'patient',
      is_active: true,
    })
  }),

  // Specialties
  http.get('*/api/v1/admin/specialties', () => {
    return HttpResponse.json(mockSpecialties)
  }),
  http.get('*/admin/specialties', () => {
    return HttpResponse.json(mockSpecialties)
  }),

  // Doctors: List
  http.get('*/api/v1/doctors', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const specialty = url.searchParams.get('specialty')

    let filtered = mockDoctors
    if (specialty) {
      filtered = filtered.filter(
        (d) => d.specialty_slug === specialty || d.specialty.toLowerCase() === specialty.toLowerCase(),
      )
    }
    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.specialty.toLowerCase().includes(search) ||
          d.bio.toLowerCase().includes(search),
      )
    }

    return HttpResponse.json({
      count: filtered.length,
      next: null,
      previous: null,
      results: filtered,
    })
  }),

  // Doctors: Detail
  http.get('*/api/v1/doctors/:id', ({ params }) => {
    const id = Number(params.id)
    const doctor = mockDoctors.find((d) => d.id === id) || mockDoctors[0]
    return HttpResponse.json(doctor)
  }),

  // Doctors: Slots
  http.get('*/api/v1/doctors/:id/slots', ({ request }) => {
    const url = new URL(request.url)
    const dateStr = url.searchParams.get('date') || new Date().toISOString().split('T')[0]
    return HttpResponse.json(generateMockSlots(dateStr))
  }),

  // Availability & TimeOff
  http.get('*/api/v1/doctors/:id/availability', () => {
    return HttpResponse.json([
      { weekday: 1, start_time: '09:00', end_time: '17:00' },
      { weekday: 2, start_time: '09:00', end_time: '17:00' },
      { weekday: 3, start_time: '09:00', end_time: '17:00' },
      { weekday: 4, start_time: '09:00', end_time: '17:00' },
      { weekday: 5, start_time: '09:00', end_time: '15:00' },
    ])
  }),
  http.post('*/api/v1/doctors/:id/availability', () => {
    return HttpResponse.json({ status: 'saved' })
  }),
  http.get('*/api/v1/doctors/:id/time-off', () => {
    return HttpResponse.json([
      { start_at: '2026-11-26T00:00:00Z', end_at: '2026-11-28T23:59:59Z', reason: 'Thanksgiving Leave' },
    ])
  }),
  http.post('*/api/v1/doctors/:id/time-off', () => {
    return HttpResponse.json({ status: 'created' }, { status: 201 })
  }),

  // Appointments: List
  http.get('*/api/v1/appointments', () => {
    return HttpResponse.json(mockAppointments)
  }),

  // Appointments: Create
  http.post('*/api/v1/appointments', async ({ request }) => {
    const body = (await request.json()) as {
      doctor_id: number
      start_at: string
      end_at?: string
      reason?: string
    }

    // Simulate 409 slot conflict if a special test condition is met
    if (body.start_at?.includes('99:99')) {
      return HttpResponse.json(
        { code: 'slot_conflict', message: 'That slot was just taken — please pick another' },
        { status: 409 },
      )
    }

    const doc = mockDoctors.find((d) => d.id === Number(body.doctor_id)) || mockDoctors[0]
    const newAppt = {
      id: Math.floor(Math.random() * 9000) + 1000,
      doctor_id: doc.id,
      doctor_name: doc.name,
      doctor_specialty: doc.specialty,
      patient_id: 1,
      patient_name: 'Alex Johnson',
      patient_email: 'alex.johnson@example.com',
      start_at: body.start_at,
      end_at: body.end_at || body.start_at,
      status: 'pending' as const,
      reason: body.reason || 'General Consultation',
      notes: '',
    }
    mockAppointments = [newAppt, ...mockAppointments]
    return HttpResponse.json(newAppt, { status: 201 })
  }),

  // Appointments: Cancel
  http.post('*/api/v1/appointments/:id/cancel', ({ params }) => {
    const id = Number(params.id)
    mockAppointments = mockAppointments.map((a) =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a,
    )
    return HttpResponse.json({ status: 'cancelled' })
  }),

  // Appointments: Reschedule
  http.post('*/api/v1/appointments/:id/reschedule', async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as { start_at: string; end_at?: string }
    mockAppointments = mockAppointments.map((a) =>
      a.id === id ? { ...a, start_at: body.start_at, end_at: body.end_at || body.start_at } : a,
    )
    return HttpResponse.json({ status: 'rescheduled' })
  }),

  // Appointments: Complete
  http.post('*/api/v1/appointments/:id/complete', ({ params }) => {
    const id = Number(params.id)
    mockAppointments = mockAppointments.map((a) =>
      a.id === id ? { ...a, status: 'completed' as const } : a,
    )
    return HttpResponse.json({ status: 'completed' })
  }),

  // Appointments: No-Show
  http.post('*/api/v1/appointments/:id/no-show', ({ params }) => {
    const id = Number(params.id)
    mockAppointments = mockAppointments.map((a) =>
      a.id === id ? { ...a, status: 'no-show' as const } : a,
    )
    return HttpResponse.json({ status: 'no-show' })
  }),

  // Notes update
  http.post('*/api/v1/appointments/:id/notes', async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as { notes: string }
    mockAppointments = mockAppointments.map((a) =>
      a.id === id ? { ...a, notes: body.notes } : a,
    )
    return HttpResponse.json({ status: 'ok' })
  }),

  // Patient Dashboard
  http.get('*/api/v1/dashboard/patient', () => {
    const upcoming = mockAppointments.filter(
      (a) => a.status === 'confirmed' || a.status === 'pending',
    ).slice(0, 3)
    const history = mockAppointments.filter(
      (a) => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no-show',
    ).slice(0, 5)

    return HttpResponse.json({
      patient_name: 'Alex Johnson',
      upcoming,
      history,
    })
  }),

  // Doctor Dashboard
  http.get('*/api/v1/dashboard/doctor', () => {
    const today = [
      {
        id: 201,
        time: '09:00 - 09:30',
        patient_name: 'Emily Davis',
        status: 'confirmed' as const,
        notes: 'Follow-up on seasonal allergies.',
      },
      {
        id: 202,
        time: '10:15 - 10:45',
        patient_name: 'Michael Smith',
        status: 'pending' as const,
        notes: 'Initial consultation for hypertension.',
      },
      {
        id: 203,
        time: '11:30 - 12:00',
        patient_name: 'Sophia Williams',
        status: 'completed' as const,
        notes: 'Prescribed antibiotic course.',
      },
      {
        id: 204,
        time: '14:00 - 14:30',
        patient_name: 'James Brown',
        status: 'confirmed' as const,
        notes: 'General checkup and cholesterol test.',
      },
    ]

    const weekAppointments = [
      { day: 'Mon', count: 6, slots: ['09:00 Emily D.', '11:00 John B.', '14:00 Liam K.'] },
      { day: 'Tue', count: 8, slots: ['09:00 Sarah T.', '10:30 Dan M.', '13:00 Chloe P.', '15:30 Nora R.'] },
      { day: 'Wed', count: 5, slots: ['10:00 Alex J.', '11:30 David L.', '14:00 Grace E.'] },
      { day: 'Thu', count: 7, slots: ['09:30 Kevin W.', '11:00 Ryan B.', '13:30 Maya G.', '16:00 Luke T.'] },
      { day: 'Fri', count: 4, slots: ['09:00 Zoey H.', '10:30 Ella C.', '13:00 Noah M.'] },
      { day: 'Sat', count: 0, slots: [] },
      { day: 'Sun', count: 0, slots: [] },
    ]

    return HttpResponse.json({
      doctor_name: 'Dr. Sarah Mitchell',
      today,
      week: weekAppointments,
    })
  }),

  // Admin Dashboard
  http.get('*/api/v1/dashboard/admin', () => {
    return HttpResponse.json({
      summary: {
        total_appointments: 1420,
        today_appointments: 34,
        cancellation_rate: 4.2,
        avg_per_doctor: 29.5,
      },
      busiest_doctors: [
        { rank: 1, name: 'Dr. Sarah Mitchell', specialty: 'General Practice', count: 184 },
        { rank: 2, name: 'Dr. Elena Rostova', specialty: 'Dermatology', count: 162 },
        { rank: 3, name: 'Dr. Marcus Chen', specialty: 'Pediatrics', count: 145 },
        { rank: 4, name: 'Dr. James Wilson', specialty: 'Cardiology', count: 118 },
        { rank: 5, name: 'Dr. Priya Patel', specialty: 'Orthopedics', count: 96 },
      ],
      busiest_hours: [
        { hour: '08:00', count: 12 },
        { hour: '09:00', count: 42 },
        { hour: '10:00', count: 58 },
        { hour: '11:00', count: 51 },
        { hour: '12:00', count: 20 },
        { hour: '13:00', count: 32 },
        { hour: '14:00', count: 64 },
        { hour: '15:00', count: 48 },
        { hour: '16:00', count: 39 },
        { hour: '17:00', count: 18 },
      ],
      recent_appointments: mockAppointments.slice(0, 10),
    })
  }),

  // Reports CSV
  http.get('*/reports/appointments.csv', () => {
    const csvContent =
      'id,doctor,patient,start_at,status\n' +
      mockAppointments
        .map((a) => `${a.id},"${a.doctor_name}","${a.patient_name}","${a.start_at}","${a.status}"`)
        .join('\n')
    return new HttpResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="appointments.csv"',
      },
    })
  }),
]
