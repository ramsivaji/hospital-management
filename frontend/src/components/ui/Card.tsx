import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'

export interface CardProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  interactive?: boolean
  elevated?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive,
  elevated = false,
  padding = 'md',
  onClick,
  style,
  className = '',
  ...props
}) => {
  const reducedMotion = useReducedMotion()
  const isInteractive = interactive ?? !!onClick

  const paddingMap = {
    none: '0',
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-8)',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={
        isInteractive && !reducedMotion
          ? { y: -2, boxShadow: 'var(--shadow-md)' }
          : undefined
      }
      transition={springPresets.smooth}
      style={{
        backgroundColor: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-separator)',
        boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        padding: paddingMap[padding],
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'border-color 150ms ease, background-color 150ms ease',
        ...style,
      }}
      className={`ui-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
