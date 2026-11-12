import React, { useState } from 'react'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  children?: React.ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, id, value, defaultValue, onFocus, onBlur, className = '', style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [innerVal, setInnerVal] = useState(value ?? defaultValue ?? '')

    const generatedId = id || React.useId()
    const hasValue = Boolean(value !== undefined ? value : innerVal)
    const isFloating = isFocused || hasValue

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 'var(--space-3)' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            ref={ref}
            id={generatedId}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              setInnerVal(e.target.value)
              props.onChange?.(e)
            }}
            onFocus={(e) => {
              setIsFocused(true)
              onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              onBlur?.(e)
            }}
            style={{
              width: '100%',
              padding: label ? '22px 36px 8px 14px' : '12px 36px 12px 14px',
              fontSize: 'var(--text-base)',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-tertiary)',
              border: `1.5px solid ${
                error
                  ? 'var(--color-brand-danger)'
                  : isFocused
                  ? 'var(--color-brand-primary)'
                  : 'var(--color-separator)'
              }`,
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              boxShadow: isFocused
                ? `0 0 0 3px ${
                    error
                      ? 'rgba(255, 59, 48, 0.2)'
                      : 'rgba(0, 122, 255, 0.2)'
                  }`
                : 'none',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
              ...style,
            }}
            className={`ui-select ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {label && (
            <label
              htmlFor={generatedId}
              style={{
                position: 'absolute',
                left: '14px',
                top: isFloating ? '6px' : '16px',
                fontSize: isFloating ? 'var(--text-xs)' : 'var(--text-base)',
                color: error
                  ? 'var(--color-brand-danger)'
                  : isFocused
                  ? 'var(--color-brand-primary)'
                  : 'var(--color-text-secondary)',
                pointerEvents: 'none',
                transition: 'all 150ms ease',
                fontWeight: isFloating ? 'var(--font-medium)' : 'var(--font-regular)',
              }}
            >
              {label}
            </label>
          )}

          {/* Chevron icon */}
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--color-text-secondary)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {error && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-brand-danger)',
              marginTop: 'var(--space-1)',
              marginLeft: 'var(--space-1)',
            }}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
