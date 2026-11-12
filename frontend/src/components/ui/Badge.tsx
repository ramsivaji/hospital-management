import React from 'react'

export type BadgeStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'

export interface BadgeProps {
  status?: BadgeStatus
  variant?: 'primary' | 'secondary' | 'neutral'
  children?: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

const statusStyles: Record<
  BadgeStatus,
  { bg: string; color: string; label: string }
> = {
  pending: {
    bg: 'var(--color-status-pending-bg)',
    color: 'var(--color-brand-warning)',
    label: 'Pending',
  },
  confirmed: {
    bg: 'var(--color-status-confirmed-bg)',
    color: 'var(--color-brand-primary)',
    label: 'Confirmed',
  },
  completed: {
    bg: 'var(--color-status-completed-bg)',
    color: 'var(--color-brand-success)',
    label: 'Completed',
  },
  cancelled: {
    bg: 'var(--color-status-cancelled-bg)',
    color: 'var(--color-brand-danger)',
    label: 'Cancelled',
  },
  'no-show': {
    bg: 'var(--color-status-noshow-bg)',
    color: 'var(--color-text-secondary)',
    label: 'No-show',
  },
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  size = 'md',
  className = '',
  style,
}) => {
  let bg = 'var(--color-bg-secondary)'
  let color = 'var(--color-text-secondary)'
  let defaultText = ''

  if (status && statusStyles[status]) {
    bg = statusStyles[status].bg
    color = statusStyles[status].color
    defaultText = statusStyles[status].label
  } else if (variant === 'primary') {
    bg = 'var(--color-status-confirmed-bg)'
    color = 'var(--color-brand-primary)'
  } else if (variant === 'secondary') {
    bg = 'rgba(88, 86, 214, 0.15)'
    color = 'var(--color-brand-secondary)'
  }

  const isSmall = size === 'sm'

  return (
    <span
      className={`ui-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 1.2,
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        color: color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children ?? defaultText}
    </span>
  )
}
