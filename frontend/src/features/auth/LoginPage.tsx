import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { springPresets } from '@/lib/motion'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/Navbar'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      showToast('Logged in successfully', 'success')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: springPresets.gentle,
    },
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8) var(--space-4)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <Card
            elevated
            padding="lg"
            style={{
              borderRadius: 'var(--radius-xl)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-brand-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <svg
                  width="24"
                  height="24"
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
              <h1
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Welcome back
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Sign in to manage your clinic appointments
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
              >
                {error && (
                  <motion.div
                    variants={itemVariants}
                    style={{
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-status-cancelled-bg)',
                      color: 'var(--color-brand-danger)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Input
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} style={{ marginTop: 'var(--space-2)' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    style={{ width: '100%' }}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            {/* Quick Demo Credentials */}
            <div
              style={{
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--color-separator)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <p style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                Demo quick logins:
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEmail('patient@example.com')
                    setPassword('password123')
                  }}
                >
                  Patient
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEmail('doctor@clinic.com')
                    setPassword('password123')
                  }}
                >
                  Doctor
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEmail('admin@clinic.com')
                    setPassword('password123')
                  }}
                >
                  Admin
                </Button>
              </div>
            </div>

            {/* Footer link */}
            <div
              style={{
                marginTop: 'var(--space-4)',
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: 'var(--color-brand-primary)',
                  fontWeight: 'var(--font-semibold)',
                }}
              >
                Sign up
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
