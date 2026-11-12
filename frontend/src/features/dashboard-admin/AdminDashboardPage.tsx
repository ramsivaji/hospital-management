import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Card } from '@/components/ui/Card'
import { Counter } from '@/components/ui/Counter'
import { Badge, BadgeStatus } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Navbar } from '@/components/Navbar'

interface AdminSummary {
  total_appointments: number
  today_appointments: number
  cancellation_rate: number
  avg_per_doctor: number
}

interface BusiestDoctor {
  rank: number
  name: string
  specialty: string
  count: number
}

interface HourlyData {
  hour: string
  count: number
}

interface RecentAppt {
  id: number
  doctor_name: string
  patient_name: string
  start_at: string
  status: BadgeStatus
}

interface AdminDashboardData {
  summary: AdminSummary
  busiest_doctors: BusiestDoctor[]
  busiest_hours: HourlyData[]
  recent_appointments: RecentAppt[]
}

export const AdminDashboardPage: React.FC = () => {
  const reducedMotion = useReducedMotion()
  const [sortField, setSortField] = useState<'count' | 'name' | 'rank'>('rank')
  const [sortAsc, setSortAsc] = useState<boolean>(true)

  const { data, isLoading } = useQuery<AdminDashboardData>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/api/v1/dashboard/admin')
      return res.data
    },
    refetchInterval: 30000,
  })

  const sortedDoctors = useMemo(() => {
    if (!data?.busiest_doctors) return []
    const list = [...data.busiest_doctors]
    list.sort((a, b) => {
      if (sortField === 'count') {
        return sortAsc ? a.count - b.count : b.count - a.count
      }
      if (sortField === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      return sortAsc ? a.rank - b.rank : b.rank - a.rank
    })
    return list
  }, [data?.busiest_doctors, sortField, sortAsc])

  const handleSort = (field: 'count' | 'name' | 'rank') => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  // Max count for chart scaling
  const maxHourCount = useMemo(() => {
    if (!data?.busiest_hours) return 1
    return Math.max(...data.busiest_hours.map((h) => h.count), 1)
  }, [data?.busiest_hours])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
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
                Clinic Analytics & Overview
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Live monitoring of appointments, staff performance, and clinical throughput
              </p>
            </div>

            <a
              href="/reports/appointments.csv"
              download="appointments.csv"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="secondary" size="md">
                📥 Download CSV Report
              </Button>
            </a>
          </div>

          {/* SUMMARY STATS ROW */}
          <section style={{ marginBottom: 'var(--space-8)' }}>
            {isLoading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height={100} style={{ borderRadius: 'var(--radius-xl)' }} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-semibold)' }}>
                    TOTAL APPOINTMENTS
                  </span>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-brand-primary)', marginTop: 'var(--space-1)' }}>
                    <Counter value={data?.summary.total_appointments ?? 0} />
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    All-time recorded
                  </span>
                </Card>

                <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-semibold)' }}>
                    TODAY'S APPOINTMENTS
                  </span>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-brand-secondary)', marginTop: 'var(--space-1)' }}>
                    <Counter value={data?.summary.today_appointments ?? 0} />
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    Scheduled for today
                  </span>
                </Card>

                <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-semibold)' }}>
                    CANCELLATION RATE
                  </span>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-brand-danger)', marginTop: 'var(--space-1)' }}>
                    <Counter value={data?.summary.cancellation_rate ?? 0} decimals={1} suffix="%" />
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    Target &lt; 5.0%
                  </span>
                </Card>

                <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-semibold)' }}>
                    AVG VISITS PER DOCTOR
                  </span>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-brand-success)', marginTop: 'var(--space-1)' }}>
                    <Counter value={data?.summary.avg_per_doctor ?? 0} decimals={1} />
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    Per weekly rotation
                  </span>
                </Card>
              </div>
            )}
          </section>

          {/* TWO COLUMN SECTION: Busiest Doctors & Busiest Hours */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-8)',
            }}
          >
            {/* BUSIEST DOCTORS TABLE */}
            <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                  Busiest Doctors
                </h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Click column headers to sort
                </span>
              </div>

              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton height={32} />
                  <Skeleton height={32} />
                  <Skeleton height={32} />
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-separator)', textAlign: 'left' }}>
                        <th
                          onClick={() => handleSort('rank')}
                          style={{ padding: '8px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                        >
                          Rank {sortField === 'rank' ? (sortAsc ? '↑' : '↓') : ''}
                        </th>
                        <th
                          onClick={() => handleSort('name')}
                          style={{ padding: '8px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                        >
                          Doctor {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
                        </th>
                        <th style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>
                          Specialty
                        </th>
                        <th
                          onClick={() => handleSort('count')}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            textAlign: 'right',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          Visits {sortField === 'count' ? (sortAsc ? '↑' : '↓') : ''}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDoctors.map((doc) => (
                        <tr
                          key={doc.name}
                          style={{ borderBottom: '1px solid var(--color-separator)' }}
                        >
                          <td style={{ padding: '10px 8px', fontWeight: 'var(--font-bold)', color: 'var(--color-text-tertiary)' }}>
                            #{doc.rank}
                          </td>
                          <td style={{ padding: '10px 8px', fontWeight: 'var(--font-semibold)' }}>
                            {doc.name}
                          </td>
                          <td style={{ padding: '10px 8px', color: 'var(--color-text-secondary)' }}>
                            {doc.specialty}
                          </td>
                          <td
                            style={{
                              padding: '10px 8px',
                              textAlign: 'right',
                              fontWeight: 'var(--font-bold)',
                              color: 'var(--color-brand-primary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {doc.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* BUSIEST HOURS BAR CHART (Pure CSS / SVG) */}
            <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                  Peak Consultation Hours
                </h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Appointment distribution throughout clinic operating hours
                </span>
              </div>

              {isLoading ? (
                <Skeleton height={200} />
              ) : (
                <div
                  style={{
                    height: '220px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 'var(--space-2)',
                    paddingTop: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-separator)',
                  }}
                >
                  {data?.busiest_hours?.map((h) => {
                    const heightPercent = Math.round((h.count / maxHourCount) * 100)
                    return (
                      <div
                        key={h.hour}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 'var(--font-bold)',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '4px',
                          }}
                        >
                          {h.count}
                        </span>
                        <motion.div
                          initial={reducedMotion ? { height: `${heightPercent}%` } : { height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={springPresets.smooth}
                          style={{
                            width: '100%',
                            minHeight: '4px',
                            borderRadius: '4px 4px 0 0',
                            backgroundColor:
                              h.count === maxHourCount
                                ? 'var(--color-brand-primary)'
                                : 'var(--color-status-confirmed-bg)',
                            border: `1px solid var(--color-brand-primary)`,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '9px',
                            color: 'var(--color-text-tertiary)',
                            marginTop: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h.hour.split(':')[0]}h
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </section>

          {/* RECENT APPOINTMENTS TABLE */}
          <section>
            <Card elevated padding="md" style={{ borderRadius: 'var(--radius-xl)' }}>
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Recent Appointments
              </h3>

              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton height={40} />
                  <Skeleton height={40} />
                  <Skeleton height={40} />
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-separator)', textAlign: 'left' }}>
                        <th style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>ID</th>
                        <th style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>Doctor</th>
                        <th style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>Patient</th>
                        <th style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>Scheduled Time</th>
                        <th style={{ padding: '8px', color: 'var(--color-text-secondary)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.recent_appointments?.map((appt) => (
                        <tr
                          key={appt.id}
                          style={{ borderBottom: '1px solid var(--color-separator)' }}
                        >
                          <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                            #{appt.id}
                          </td>
                          <td style={{ padding: '10px 8px', fontWeight: 'var(--font-medium)' }}>
                            {appt.doctor_name}
                          </td>
                          <td style={{ padding: '10px 8px' }}>{appt.patient_name}</td>
                          <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)' }}>
                            {appt.start_at}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <Badge status={appt.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
