import React from 'react'
import { motion } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'

export interface TabItem {
  id: string
  label: string
  badge?: number | string
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
  style?: React.CSSProperties
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  style,
}) => {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`ui-tabs ${className}`}
      role="tablist"
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-separator)',
        gap: 'var(--space-2)',
        position: 'relative',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-base)',
              fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
              color: isActive
                ? 'var(--color-brand-primary)'
                : 'var(--color-text-secondary)',
              transition: 'color 150ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive
                    ? 'var(--color-status-confirmed-bg)'
                    : 'var(--color-bg-secondary)',
                  color: isActive
                    ? 'var(--color-brand-primary)'
                    : 'var(--color-text-secondary)',
                }}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="tabs-active-indicator"
                transition={reducedMotion ? { duration: 0 } : springPresets.smooth}
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'var(--color-brand-primary)',
                  borderRadius: '1px',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
