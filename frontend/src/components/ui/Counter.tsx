import React, { useEffect, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'

export interface CounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  style?: React.CSSProperties
}

export const Counter: React.FC<CounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  style,
}) => {
  const reducedMotion = useReducedMotion()
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, springPresets.bouncy)
  const [displayValue, setDisplayValue] = useState<string>(
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value),
  )

  useEffect(() => {
    if (reducedMotion) {
      motionVal.set(value)
      setDisplayValue(
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value),
      )
      return
    }

    motionVal.set(value)
  }, [value, motionVal, reducedMotion, decimals])

  useEffect(() => {
    if (reducedMotion) return

    const unsubscribe = springVal.on('change', (latest) => {
      setDisplayValue(
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(latest),
      )
    })

    return () => unsubscribe()
  }, [springVal, reducedMotion, decimals])

  return (
    <span
      className={`ui-counter ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
