import React, { useState } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, value, defaultValue, onFocus, onBlur, className = '', style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [innerVal, setInnerVal] = useState(value ?? defaultValue ?? '')

    const generatedId = id || React.useId()
    const hasValue = Boolean(value !== undefined ? value : innerVal)
    const isFloating = isFocused || hasValue

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 'var(--space-3)' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          <input
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
              padding: label ? '22px 14px 8px 14px' : '12px 14px',
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
              boxShadow: isFocused
                ? `0 0 0 3px ${
                    error
                      ? 'rgba(255, 59, 48, 0.2)'
                      : 'rgba(0, 122, 255, 0.2)'
                  }`
                : 'none',
              transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
              ...style,
            }}
            className={`ui-input ${className}`}
            {...props}
          />
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
        </div>
        {error ? (
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
        ) : helperText ? (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-1)',
              marginLeft: 'var(--space-1)',
            }}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
