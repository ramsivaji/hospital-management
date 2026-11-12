import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-separator)',
        backgroundColor: 'var(--color-bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--space-4)',
          minHeight: '64px',
          height: 'auto',
          minWidth: 0,
          flexWrap: 'wrap',
          rowGap: 'var(--space-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            textDecoration: 'none',
            color: 'var(--color-text-primary)',
            fontWeight: 'var(--font-bold)',
            fontSize: 'var(--text-lg)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <span>AuraClinic</span>
        </Link>

        {/* Navigation links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: 'var(--space-2) 0',
          }}
        >
          <Link
            to="/doctors"
            style={{
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--font-medium)',
              fontSize: 'var(--text-base)',
            }}
          >
            Find Doctors
          </Link>

          <Link
            to="/showcase"
            style={{
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--font-medium)',
              fontSize: 'var(--text-base)',
            }}
          >
            UI Kit
          </Link>

          {user && (
            <Link
              to={
                user.role === 'doctor'
                  ? '/dashboard/doctor'
                  : user.role === 'admin'
                  ? '/dashboard/admin'
                  : '/dashboard/patient'
              }
              style={{
                color: 'var(--color-brand-primary)',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-base)',
              }}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle theme"
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-separator)',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              // Moon icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Avatar name={user.name} size="sm" />
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
              >
                Log out
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
