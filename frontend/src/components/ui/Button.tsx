import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Spinner } from './Spinner'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode
  icon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      icon,
      style,
      className = '',
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion()

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: '6px 12px',
        fontSize: 'var(--text-sm)',
        borderRadius: 'var(--radius-sm)',
        gap: '6px',
        minHeight: '32px',
      },
      md: {
        padding: '10px 18px',
        fontSize: 'var(--text-base)',
        borderRadius: 'var(--radius-md)',
        gap: '8px',
        minHeight: '42px',
      },
      lg: {
        padding: '14px 24px',
        fontSize: 'var(--text-md)',
        borderRadius: 'var(--radius-lg)',
        gap: '10px',
        minHeight: '50px',
      },
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-brand-primary)',
        color: '#FFFFFF',
        border: '1px solid transparent',
      },
      secondary: {
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-separator)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-brand-primary)',
        border: '1px solid transparent',
      },
      danger: {
        backgroundColor: 'var(--color-brand-danger)',
        color: '#FFFFFF',
        border: '1px solid transparent',
      },
    }

    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileTap={isDisabled || reducedMotion ? undefined : { scale: 0.97 }}
        whileHover={isDisabled || reducedMotion ? undefined : { opacity: 0.9 }}
        transition={reducedMotion ? { duration: 0 } : springPresets.snappy}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'var(--font-semibold)',
          fontFamily: 'var(--font-sans)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1,
          transition: 'background-color 150ms ease, border-color 150ms ease',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        className={`ui-button ui-button-${variant} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={size === 'lg' ? 'md' : 'sm'} />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
