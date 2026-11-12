import React from 'react'

export interface AvatarProps {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  style?: React.CSSProperties
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

const colorPalette = [
  '#007AFF',
  '#5856D6',
  '#34C759',
  '#FF9500',
  '#FF2D55',
  '#AF52DE',
  '#00C7BE',
  '#32ADE6',
]

function getHashColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colorPalette.length
  return colorPalette[index]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return '?'
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  src,
  size = 'md',
  className = '',
  style,
}) => {
  const [imageError, setImageError] = React.useState(false)
  const pixelSize = sizeMap[size]
  const initials = getInitials(name)
  const bgColor = getHashColor(name || 'default')

  return (
    <div
      className={`ui-avatar ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        minWidth: pixelSize,
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: '#FFFFFF',
        fontWeight: 'var(--font-semibold)',
        fontSize: pixelSize * 0.4,
        userSelect: 'none',
        ...style,
      }}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
