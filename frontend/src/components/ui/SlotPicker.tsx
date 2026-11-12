import React from 'react'
import { motion } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Skeleton } from './Skeleton'

export interface TimeSlot {
  start: string // ISO string or time "09:00"
  end: string
}

export interface SlotPickerProps {
  slots?: TimeSlot[]
  selectedSlot?: TimeSlot | null
  onSelect: (slot: TimeSlot) => void
  isLoading?: boolean
  className?: string
}

function formatSlotTime(timeStr: string): string {
  try {
    if (timeStr.includes('T')) {
      const date = new Date(timeStr)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return timeStr
  } catch {
    return timeStr
  }
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots = [],
  selectedSlot,
  onSelect,
  isLoading = false,
  className = '',
}) => {
  const reducedMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            height={44}
            style={{ borderRadius: 'var(--radius-md)' }}
          />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <p style={{ margin: 0, fontSize: 'var(--text-base)' }}>
          No available slots for this date.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`ui-slot-picker ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: 'var(--space-3)',
      }}
    >
      {slots.map((slot, idx) => {
        const isSelected =
          selectedSlot &&
          selectedSlot.start === slot.start &&
          selectedSlot.end === slot.end

        return (
          <motion.button
            key={`${slot.start}-${idx}`}
            type="button"
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            transition={reducedMotion ? { duration: 0 } : springPresets.snappy}
            onClick={() => onSelect(slot)}
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
                : 'var(--color-bg-tertiary)',
              color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
              fontWeight: isSelected ? 'var(--font-semibold)' : 'var(--font-medium)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            {formatSlotTime(slot.start)}
          </motion.button>
        )
      })}
    </div>
  )
}
