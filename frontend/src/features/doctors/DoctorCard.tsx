import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { springPresets, useReducedMotion } from '@/lib/motion'

export interface Doctor {
  id: number
  name: string
  email: string
  specialty: string
  specialty_slug?: string
  bio: string
  avatar_url?: string
  slot_minutes?: number
  buffer_minutes?: number
  rating?: number
  review_count?: number
  availability_preview?: string[]
}

export interface DoctorCardProps {
  doctor: Doctor
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()

  return (
    <Card
      interactive
      elevated
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-6)',
        height: '100%',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {/* Shared element transition on avatar */}
          <motion.div
            layoutId={reducedMotion ? undefined : `doctor-avatar-${doctor.id}`}
            transition={reducedMotion ? { duration: 0 } : springPresets.smooth}
            style={{ flexShrink: 0 }}
          >
            <Avatar name={doctor.name} src={doctor.avatar_url} size="lg" />
          </motion.div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)',
                lineHeight: 1.2,
              }}
            >
              {doctor.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Badge variant="primary">{doctor.specialty}</Badge>
              {doctor.rating && (
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontWeight: 'var(--font-semibold)',
                  }}
                >
                  <span style={{ color: 'var(--color-brand-warning)' }}>★</span> {doctor.rating}
                  {doctor.review_count && (
                    <span style={{ color: 'var(--color-text-tertiary)' }}>
                      ({doctor.review_count})
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            marginBottom: 'var(--space-5)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {doctor.bio}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-separator)',
          paddingTop: 'var(--space-4)',
          marginTop: 'var(--space-2)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            fontWeight: 'var(--font-medium)',
          }}
        >
          {doctor.slot_minutes ?? 30} min visit
        </span>

        <Button
          size="sm"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/book/${doctor.id}`)
          }}
        >
          Book Now
        </Button>
      </div>
    </Card>
  )
}
