import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { SlotPicker, TimeSlot } from '@/components/ui/SlotPicker'
import { useToast } from '@/components/ui/Toast'
import { Navbar } from '@/components/Navbar'
import { Doctor } from '../doctors/DoctorCard'

export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const reducedMotion = useReducedMotion()

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [reason, setReason] = useState<string>('General Consultation')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdAppointment, setCreatedAppointment] = useState<any>(null)

  // Fetch Doctor info
  const { data: doctor } = useQuery<Doctor>({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/doctors/${doctorId}`)
      return res.data
    },
    enabled: !!doctorId,
  })

  // Fetch Slots for doctor & date (auto-refetch every 30s)
  const {
    data: slots = [],
    isLoading: isSlotsLoading,
    refetch: refetchSlots,
  } = useQuery<TimeSlot[]>({
    queryKey: ['doctor-slots', doctorId, selectedDate],
    queryFn: async () => {
      const res = await api.get(`/api/v1/doctors/${doctorId}/slots`, {
        params: { date: selectedDate },
      })
      return res.data
    },
    enabled: !!doctorId && !!selectedDate,
    refetchInterval: 30000,
  })

  const goToStep = (nextStep: 1 | 2 | 3 | 4) => {
    setDirection(nextStep > step ? 'forward' : 'backward')
    setStep(nextStep)
  }

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !doctorId) return
    setIsSubmitting(true)

    try {
      const payload = {
        doctor_id: Number(doctorId),
        start_at: selectedSlot.start,
        end_at: selectedSlot.end,
        reason,
      }
      const res = await api.post('/api/v1/appointments', payload)
      setCreatedAppointment(res.data)
      goToStep(4)
      showToast('Appointment confirmed!', 'success')
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('That slot was just taken — please pick another', 'error')
        refetchSlots()
        goToStep(2)
      } else {
        showToast(err.response?.data?.message || 'Booking failed. Try again.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const slideVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir === 'forward' ? 60 : -60,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: reducedMotion ? { duration: 0 } : springPresets.smooth,
    },
    exit: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir === 'forward' ? -60 : 60,
      transition: reducedMotion ? { duration: 0 } : springPresets.smooth,
    }),
  }

  // Mini date generator for calendar grid
  const daysToShow = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      iso: d.toISOString().split('T')[0],
      weekday: d.toLocaleDateString([], { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString([], { month: 'short' }),
    }
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Doctor Brief Card */}
          {doctor && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-separator)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <Avatar name={doctor.name} src={doctor.avatar_url} size="md" />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>
                  {doctor.name}
                </h4>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {doctor.specialty} • {doctor.slot_minutes ?? 30} mins
                </span>
              </div>
              <Badge variant="primary">Step {step} of 4</Badge>
            </div>
          )}

          {/* Stepper Progress Bar */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-8)',
            }}
          >
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor:
                    s <= step ? 'var(--color-brand-primary)' : 'var(--color-separator)',
                  transition: 'background-color 200ms ease',
                }}
              />
            ))}
          </div>

          <Card elevated padding="lg" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              {/* STEP 1: SELECT DATE */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <h2
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-bold)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Select an Appointment Date
                  </h2>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--space-6)',
                    }}
                  >
                    Choose a day from the next two weeks to check available appointment hours.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                      gap: 'var(--space-3)',
                      marginBottom: 'var(--space-8)',
                    }}
                  >
                    {daysToShow.map((item) => {
                      const isSelected = selectedDate === item.iso
                      return (
                        <button
                          key={item.iso}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.iso)
                            setSelectedSlot(null)
                          }}
                          style={{
                            padding: 'var(--space-3) var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${
                              isSelected
                                ? 'var(--color-brand-primary)'
                                : 'var(--color-separator)'
                            }`,
                            backgroundColor: isSelected
                              ? 'var(--color-brand-primary)'
                              : 'var(--color-bg-secondary)',
                            color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                          }}
                        >
                          <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                            {item.weekday}
                          </span>
                          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>
                            {item.dayNumber}
                          </span>
                          <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                            {item.month}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => goToStep(2)}
                    >
                      Next: Choose Time Slot →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SELECT TIME SLOT */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: 'var(--text-xl)',
                          fontWeight: 'var(--font-bold)',
                          margin: 0,
                        }}
                      >
                        Choose Time Slot
                      </h2>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        Date: {selectedDate} (live availability updates every 30s)
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => refetchSlots()}
                    >
                      ↻ Refresh
                    </Button>
                  </div>

                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    <SlotPicker
                      slots={slots}
                      selectedSlot={selectedSlot}
                      onSelect={(s) => setSelectedSlot(s)}
                      isLoading={isSlotsLoading}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--color-separator)',
                      paddingTop: 'var(--space-5)',
                    }}
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => goToStep(1)}
                    >
                      ← Back
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      disabled={!selectedSlot}
                      onClick={() => goToStep(3)}
                    >
                      Review Booking →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CONFIRMATION & SUMMARY */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <h2
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-bold)',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    Confirm Your Appointment
                  </h2>

                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-6)',
                      marginBottom: 'var(--space-6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Doctor
                      </span>
                      <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                        {doctor?.name} ({doctor?.specialty})
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Date
                      </span>
                      <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                        {selectedDate}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Time
                      </span>
                      <span
                        style={{
                          fontWeight: 'var(--font-bold)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-brand-primary)',
                        }}
                      >
                        {selectedSlot?.start.includes('T')
                          ? new Date(selectedSlot.start).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : selectedSlot?.start}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Duration
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)' }}>
                        {doctor?.slot_minutes ?? 30} minutes
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      Reason for consultation (optional)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Annual checkup, consultation"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-separator)',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--text-base)',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--color-separator)',
                      paddingTop: 'var(--space-5)',
                    }}
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => goToStep(2)}
                    >
                      ← Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      onClick={handleConfirmBooking}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS WITH BOUNCY CHECKMARK */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}
                >
                  <motion.div
                    initial={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    transition={springPresets.bouncy}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-status-completed-bg)',
                      color: 'var(--color-brand-success)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>

                  <h2
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-bold)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Appointment Confirmed!
                  </h2>
                  <p
                    style={{
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      maxWidth: '440px',
                      margin: '0 auto var(--space-6)',
                    }}
                  >
                    Your appointment with {doctor?.name} is booked. We have sent a confirmation email with appointment details.
                  </p>

                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-4)',
                      maxWidth: '380px',
                      margin: '0 auto var(--space-8)',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <div><strong>Booking ID:</strong> #{createdAppointment?.id || '101'}</div>
                    <div><strong>Date & Time:</strong> {selectedDate} at {selectedSlot?.start.includes('T') ? new Date(selectedSlot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : selectedSlot?.start}</div>
                    <div><strong>Status:</strong> <Badge status="confirmed" size="sm" /></div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate('/dashboard/patient')}
                    >
                      View My Appointments
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/doctors')}
                    >
                      Done
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </main>
    </div>
  )
}
