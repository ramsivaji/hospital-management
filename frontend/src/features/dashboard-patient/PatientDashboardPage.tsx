import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/Card'
import { Badge, BadgeStatus } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { Navbar } from '@/components/Navbar'

interface AppointmentItem {
  id: number
  doctor_id: number
  doctor_name: string
  doctor_specialty: string
  start_at: string
  end_at: string
  status: BadgeStatus
  reason?: string
}

interface PatientDashboardData {
  patient_name: string
  upcoming: AppointmentItem[]
  history: AppointmentItem[]
}

function isWithinTwoHours(dateStr: string): boolean {
  try {
    const apptTime = new Date(dateStr).getTime()
    const now = Date.now()
    const diffHours = (apptTime - now) / (1000 * 60 * 60)
    return diffHours >= 0 && diffHours < 2
  } catch {
    return false
  }
}

function formatApptTime(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const {
    data,
    isLoading,
    refetch,
  } = useQuery<PatientDashboardData>({
    queryKey: ['patient-dashboard'],
    queryFn: async () => {
      const res = await api.get('/api/v1/dashboard/patient')
      return res.data
    },
    refetchInterval: 30000,
  })

  const handleOpenCancel = (appt: AppointmentItem) => {
    setSelectedAppointment(appt)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return
    setIsCancelling(true)

    try {
      await api.post(`/api/v1/appointments/${selectedAppointment.id}/cancel`)
      showToast('Appointment successfully cancelled.', 'info')
      setCancelModalOpen(false)
      setSelectedAppointment(null)
      refetch()
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel appointment.', 'error')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Greeting */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-8)',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Welcome back, {data?.patient_name || user?.name || 'Patient'}
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Manage your scheduled consultations, history, and records
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/doctors')}
            >
              + Book New Visit
            </Button>
          </div>

          {/* UPCOMING SECTION */}
          <section style={{ marginBottom: 'var(--space-12)' }}>
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Upcoming Appointments
            </h2>

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Skeleton height={90} style={{ borderRadius: 'var(--radius-lg)' }} />
                <Skeleton height={90} style={{ borderRadius: 'var(--radius-lg)' }} />
              </div>
            ) : !data?.upcoming || data.upcoming.length === 0 ? (
              <Card elevated padding="lg" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                  You have no upcoming appointments booked.
                </p>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/doctors')}>
                    Find a Doctor
                  </Button>
                </div>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {data.upcoming.map((appt) => {
                  const within2h = isWithinTwoHours(appt.start_at)

                  return (
                    <Card
                      key={appt.id}
                      elevated
                      padding="md"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 'var(--space-4)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <span
                            style={{
                              fontSize: 'var(--text-md)',
                              fontWeight: 'var(--font-bold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {appt.doctor_name}
                          </span>
                          <Badge status={appt.status} size="sm" />
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          {appt.doctor_specialty} • {appt.reason || 'General Consultation'}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--color-brand-primary)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {formatApptTime(appt.start_at)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/book/${appt.doctor_id}`)}
                        >
                          Reschedule
                        </Button>

                        <div title={within2h ? 'Cannot cancel within 2 hours of appointment' : undefined}>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={within2h}
                            onClick={() => handleOpenCancel(appt)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          {/* HISTORY SECTION */}
          <section>
            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Past Consultation History
            </h2>

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
              </div>
            ) : !data?.history || data.history.length === 0 ? (
              <Card elevated padding="md" style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>No past appointments recorded.</p>
              </Card>
            ) : (
              <Card elevated padding="none" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {data.history.map((appt, idx) => (
                    <div
                      key={appt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-4) var(--space-5)',
                        borderBottom:
                          idx < data.history.length - 1
                            ? '1px solid var(--color-separator)'
                            : 'none',
                        flexWrap: 'wrap',
                        gap: 'var(--space-3)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)' }}>
                            {appt.doctor_name}
                          </span>
                          <Badge status={appt.status} size="sm" />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {formatApptTime(appt.start_at)} • {appt.doctor_specialty}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/book/${appt.doctor_id}`)}
                      >
                        Rebook
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>
        </div>
      </main>

      {/* CANCEL MODAL */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
      >
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-6)',
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to cancel your appointment with{' '}
          <strong>{selectedAppointment?.doctor_name}</strong> on{' '}
          <strong>
            {selectedAppointment?.start_at && formatApptTime(selectedAppointment.start_at)}
          </strong>
          ? This slot will be released to other patients.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setCancelModalOpen(false)}
          >
            Keep Appointment
          </Button>
          <Button
            variant="danger"
            size="md"
            loading={isCancelling}
            onClick={handleConfirmCancel}
          >
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
