import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const reducedMotion = useReducedMotion()

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => {
        removeToast(id)
      }, 3000)
    },
    [removeToast]
  )

  const variantColors: Record<ToastVariant, { bg: string; fg: string; border: string }> = {
    success: {
      bg: 'var(--color-bg-primary)',
      fg: 'var(--color-brand-success)',
      border: 'var(--color-brand-success)',
    },
    error: {
      bg: 'var(--color-bg-primary)',
      fg: 'var(--color-brand-danger)',
      border: 'var(--color-brand-danger)',
    },
    info: {
      bg: 'var(--color-bg-primary)',
      fg: 'var(--color-brand-primary)',
      border: 'var(--color-brand-primary)',
    },
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const colors = variantColors[toast.variant]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={reducedMotion ? { duration: 0 } : springPresets.snappy}
                style={{
                  pointerEvents: 'auto',
                  padding: '12px 16px',
                  backgroundColor: colors.bg,
                  color: 'var(--color-text-primary)',
                  borderLeft: `4px solid ${colors.border}`,
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  minWidth: 260,
                  maxWidth: 380,
                }}
              >
                <span style={{ color: colors.fg, fontSize: 16 }}>
                  {toast.variant === 'success' && '✓'}
                  {toast.variant === 'error' && '✕'}
                  {toast.variant === 'info' && 'ℹ'}
                </span>
                <span style={{ flex: 1 }}>{toast.message}</span>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
