import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/Card'
import { Badge, BadgeStatus } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { Navbar } from '@/components/Navbar'

interface TodayAppointment {
  id: number
  time: string
  patient_name: string
  status: BadgeStatus
  notes: string
}

interface WeekDay {
  day: string
  count: number
  slots: string[]
}

interface DoctorDashboardData {
  doctor_name: string
  today: TodayAppointment[]
  week: WeekDay[]
}

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today')

  // Notes state for inline editing
  const [notesState, setNotesState] = useState<Record<number, string>>({})

  // Modal confirmations
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean
    type: 'complete' | 'no-show' | null
    appointmentId: number | null
    patientName: string
  }>({
    isOpen: false,
    type: null,
    appointmentId: null,
    patientName: '',
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const { data, isLoading, refetch } = useQuery<DoctorDashboardData>({
    queryKey: ['doctor-dashboard'],
    queryFn: async () => {
      const res = await api.get('/api/v1/dashboard/doctor')
      return res.data
    },
    refetchInterval: 30000,
  })

  // Handle note blur and auto-save
  const handleNoteBlur = async (id: number) => {
    const noteText = notesState[id]
    if (noteText === undefined) return

    try {
      await api.post(`/api/v1/appointments/${id}/notes`, { notes: noteText })
      showToast('Notes saved', 'info')
    } catch {
      showToast('Failed to save notes', 'error')
    }
  }

  // Open confirmation
  const handleOpenAction = (id: number, patientName: string, type: 'complete' | 'no-show') => {
    setActionModal({
      isOpen: true,
      type,
      appointmentId: id,
      patientName,
    })
  }

  // Confirm action
  const handleConfirmAction = async () => {
    if (!actionModal.appointmentId || !actionModal.type) return
    setIsUpdating(true)

    try {
      if (actionModal.type === 'complete') {
        await api.post(`/api/v1/appointments/${actionModal.appointmentId}/complete`)
        showToast('Appointment marked as completed.', 'success')
      } else {
        await api.post(`/api/v1/appointments/${actionModal.appointmentId}/no-show`)
        showToast('Marked as no-show.', 'info')
      }
      setActionModal({ isOpen: false, type: null, appointmentId: null, patientName: '' })
      refetch()
    } catch {
      showToast('Action failed', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)',
              }}
            >
              Doctor Schedule & Consultations
            </h1>
            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              Logged in as {data?.doctor_name || user?.name || 'Dr. Sarah Mitchell'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <Tabs
              tabs={[
                { id: 'today', label: 'Today', badge: data?.today?.length || 0 },
                { id: 'week', label: 'This Week' },
              ]}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as 'today' | 'week')}
            />
          </div>

          {/* TAB 1: TODAY */}
          {activeTab === 'today' && (
            <div>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Skeleton height={140} style={{ borderRadius: 'var(--radius-lg)' }} />
                  <Skeleton height={140} style={{ borderRadius: 'var(--radius-lg)' }} />
                </div>
              ) : !data?.today || data.today.length === 0 ? (
                <Card elevated padding="lg" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  <p style={{ margin: 0 }}>No consultations scheduled for today.</p>
                </Card>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  {data.today.map((appt) => {
                    const currentNote =
                      notesState[appt.id] !== undefined ? notesState[appt.id] : appt.notes

                    return (
                      <Card
                        key={appt.id}
                        elevated
                        padding="md"
                        style={{
                          borderRadius: 'var(--radius-xl)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 'var(--space-3)',
                            marginBottom: 'var(--space-4)',
                            borderBottom: '1px solid var(--color-separator)',
                            paddingBottom: 'var(--space-3)',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                              <span
                                style={{
                                  fontSize: 'var(--text-lg)',
                                  fontWeight: 'var(--font-bold)',
                                  color: 'var(--color-text-primary)',
                                }}
                              >
                                {appt.patient_name}
                              </span>
                              <Badge status={appt.status} size="sm" />
                            </div>
                            <span
                              style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-brand-primary)',
                                fontWeight: 'var(--font-semibold)',
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              🕒 {appt.time}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            {appt.status !== 'completed' && appt.status !== 'no-show' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleOpenAction(appt.id, appt.patient_name, 'complete')}
                                >
                                  Complete Visit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenAction(appt.id, appt.patient_name, 'no-show')}
                                >
                                  No-Show
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Notes Auto-save textarea */}
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-semibold)',
                              color: 'var(--color-text-secondary)',
                              marginBottom: 'var(--space-1)',
                            }}
                          >
                            Clinical Notes (Auto-saved on blur)
                          </label>
                          <textarea
                            value={currentNote}
                            onChange={(e) =>
                              setNotesState((prev) => ({ ...prev, [appt.id]: e.target.value }))
                            }
                            onBlur={() => handleNoteBlur(appt.id)}
                            placeholder="Add diagnostic notes, recommendations, or medication history..."
                            rows={2}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--color-separator)',
                              backgroundColor: 'var(--color-bg-tertiary)',
                              color: 'var(--color-text-primary)',
                              fontSize: 'var(--text-sm)',
                              fontFamily: 'var(--font-sans)',
                              resize: 'vertical',
                            }}
                          />
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: THIS WEEK GRID */}
          {activeTab === 'week' && (
            <div>
              {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)' }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} height={300} style={{ borderRadius: 'var(--radius-md)' }} />
                  ))}
                </div>
              ) : !data?.week || data.week.length === 0 ? (
                <Card elevated padding="lg" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  <p style={{ margin: 0 }}>No weekly schedule data available.</p>
                </Card>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: 'var(--space-3)',
                  }}
                >
                  {data.week.map((col) => (
                    <div
                      key={col.day}
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-separator)',
                        padding: 'var(--space-3)',
                        minHeight: '260px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          borderBottom: '1px solid var(--color-separator)',
                          paddingBottom: 'var(--space-2)',
                          marginBottom: 'var(--space-3)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
                          {col.day}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-secondary)',
                            fontWeight: 'var(--font-semibold)',
                          }}
                        >
                          {col.count}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
                        {col.slots.length === 0 ? (
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              color: 'var(--color-text-tertiary)',
                              fontStyle: 'italic',
                              margin: 'auto 0',
                              textAlign: 'center',
                            }}
                          >
                            No visits
                          </span>
                        ) : (
                          col.slots.map((s, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '6px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                border: '1px solid var(--color-separator)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-medium)',
                                color: 'var(--color-text-primary)',
                                boxShadow: 'var(--shadow-sm)',
                              }}
                            >
                              {s}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* CONFIRMATION ACTION MODAL */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: null, appointmentId: null, patientName: '' })}
        title={actionModal.type === 'complete' ? 'Complete Consultation' : 'Mark as No-Show'}
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          {actionModal.type === 'complete' ? (
            <>
              Confirm that the consultation with <strong>{actionModal.patientName}</strong> has concluded. The appointment status will change to <em>Completed</em>.
            </>
          ) : (
            <>
              Are you sure you want to mark <strong>{actionModal.patientName}</strong> as a no-show?
            </>
          )}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setActionModal({ isOpen: false, type: null, appointmentId: null, patientName: '' })}
          >
            Cancel
          </Button>
          <Button
            variant={actionModal.type === 'complete' ? 'primary' : 'danger'}
            size="md"
            loading={isUpdating}
            onClick={handleConfirmAction}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  )
}
