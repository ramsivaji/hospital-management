import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Navbar } from '@/components/Navbar'
import { Doctor } from './DoctorCard'

interface AvailabilitySlot {
  weekday: number
  start_time: string
  end_time: string
}

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()

  const { data: doctor, isLoading: isDoctorLoading } = useQuery<Doctor>({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/doctors/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  const { data: availability = [], isLoading: isAvailLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ['doctor-availability', id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/doctors/${id}/availability`)
      return res.data
    },
    enabled: !!id,
  })

  if (isDoctorLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            <Skeleton width={120} height={120} circle />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton width="50%" height={32} />
              <Skeleton width="30%" height={20} />
              <Skeleton width="100%" height={60} />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2>Doctor Not Found</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>The doctor you requested does not exist or has been removed.</p>
            <Button variant="primary" onClick={() => navigate('/doctors')}>
              Back to Doctors
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
            <Link to="/doctors" style={{ color: 'var(--color-text-secondary)' }}>
              ← Back to all doctors
            </Link>
          </div>

          {/* Hero Section */}
          <Card
            elevated
            padding="lg"
            style={{
              marginBottom: 'var(--space-8)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-6)',
                flexWrap: 'wrap',
              }}
            >
              {/* Shared element avatar */}
              <motion.div
                layoutId={reducedMotion ? undefined : `doctor-avatar-${doctor.id}`}
                transition={reducedMotion ? { duration: 0 } : springPresets.smooth}
              >
                <Avatar
                  name={doctor.name}
                  src={doctor.avatar_url}
                  size="xl"
                  style={{ width: 100, height: 100, fontSize: 36 }}
                />
              </motion.div>

              <div style={{ flex: 1, minWidth: '260px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <h1
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-text-primary)',
                      margin: 0,
                    }}
                  >
                    {doctor.name}
                  </h1>

                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigate(`/book/${doctor.id}`)}
                  >
                    Book Appointment
                  </Button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                    flexWrap: 'wrap',
                  }}
                >
                  <Badge variant="primary">{doctor.specialty}</Badge>
                  {doctor.rating && (
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ color: 'var(--color-brand-warning)' }}>★</span> {doctor.rating}
                      {doctor.review_count && (
                        <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>
                          ({doctor.review_count} verified reviews)
                        </span>
                      )}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    • {doctor.slot_minutes ?? 30} min session
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {doctor.bio}
                </p>
              </div>
            </div>
          </Card>

          {/* Schedule / Availability Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <Card elevated padding="md">
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-4)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Weekly Consultation Schedule
              </h3>

              {isAvailLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <Skeleton height={24} />
                  <Skeleton height={24} />
                  <Skeleton height={24} />
                </div>
              ) : availability.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Regular hours: Monday - Friday, 09:00 - 17:00
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {availability.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-2) 0',
                        borderBottom: '1px solid var(--color-separator)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text-primary)' }}>
                        {weekdayNames[item.weekday] || `Day ${item.weekday}`}
                      </span>
                      <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {item.start_time} – {item.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card elevated padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                    marginBottom: 'var(--space-4)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Visit Information
                </h3>
                <ul
                  style={{
                    paddingLeft: 'var(--space-5)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.8,
                  }}
                >
                  <li>Consultations held online or in clinic branch</li>
                  <li>Free cancellation up to 2 hours before start time</li>
                  <li>Digital medical records and reminders included</li>
                  <li>Buffer time maintained between visits for quality care</li>
                </ul>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Button
                  variant="primary"
                  size="md"
                  style={{ width: '100%' }}
                  onClick={() => navigate(`/book/${doctor.id}`)}
                >
                  Select Date & Book Slot
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
