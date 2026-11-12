import React from 'react'

export interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
  style,
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
        borderRadius: circle ? 'var(--radius-full)' : 'var(--radius-sm)',
        display: 'inline-block',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
