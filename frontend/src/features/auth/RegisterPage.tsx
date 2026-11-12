import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { springPresets } from '@/lib/motion'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/Navbar'

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await register(name, email, password, role)
      showToast('Account created successfully!', 'success')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create account.'
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
          alignItems: 'flex-start',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          padding: 'clamp(32px, 8vh, 72px) var(--space-4) var(--space-12)',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '460px' }}>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
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
                Create your account
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Join AuraClinic to schedule or manage appointments
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
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
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                  />
                </motion.div>

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
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Select
                    label="I am joining as a"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'patient' | 'doctor')}
                    options={[
                      { value: 'patient', label: 'Patient (Booking visits)' },
                      { value: 'doctor', label: 'Doctor (Managing schedule)' },
                    ]}
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
                    Complete Registration
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            {/* Footer link */}
            <div
              style={{
                marginTop: 'var(--space-6)',
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--color-brand-primary)',
                  fontWeight: 'var(--font-semibold)',
                }}
              >
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
