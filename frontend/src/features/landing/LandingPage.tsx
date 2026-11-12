import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Counter } from '@/components/ui/Counter'
import { Navbar } from '@/components/Navbar'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()

  const words = ['Book', 'your', 'appointment,', 'effortlessly.']

  const specialties = [
    { name: 'General Practice', slug: 'general-practice', icon: '🩺' },
    { name: 'Cardiology', slug: 'cardiology', icon: '❤️' },
    { name: 'Dermatology', slug: 'dermatology', icon: '✨' },
    { name: 'Pediatrics', slug: 'pediatrics', icon: '👶' },
    { name: 'Orthopedics', slug: 'orthopedics', icon: '🦴' },
    { name: 'Neurology', slug: 'neurology', icon: '🧠' },
  ]

  const steps = [
    {
      step: '01',
      title: 'Find Your Doctor',
      desc: 'Browse certified specialists by specialty, availability, and real patient reviews.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Choose a Slot',
      desc: 'Select the exact date and real-time open time slot that fits your schedule seamlessly.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Get Care & Reminders',
      desc: 'Instant confirmation, email reminders, and effortless rescheduling whenever you need it.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--space-20) var(--space-4) var(--space-16)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 50% 10%, rgba(0, 122, 255, 0.08) 0%, transparent 70%)',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={springPresets.gentle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-status-confirmed-bg)',
              color: 'var(--color-brand-primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <span>Modern Healthcare Scheduling</span>
          </motion.div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              lineHeight: 1.1,
              fontWeight: 'var(--font-bold)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.3em',
            }}
          >
            {words.map((word, index) => (
              <motion.span
                key={word}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24, rotate: index % 2 === 0 ? -1 : 1 }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, rotate: 0 }
                }
                transition={{
                  ...springPresets.smooth,
                  delay: index * 0.1,
                }}
                style={{
                  color:
                    word === 'effortlessly.'
                      ? 'var(--color-brand-primary)'
                      : 'var(--color-text-primary)',
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ ...springPresets.smooth, delay: 0.4 }}
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '620px',
              margin: '0 auto var(--space-8)',
            }}
          >
            Experience seamless doctor appointments with real-time slot booking, instant confirmation, and smart reminders.
          </motion.p>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ ...springPresets.smooth, delay: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/doctors')}
            >
              Find a Doctor
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Specialties Horizontal Strip */}
      <section
        style={{
          padding: 'var(--space-8) var(--space-4)',
          borderTop: '1px solid var(--color-separator)',
          borderBottom: '1px solid var(--color-separator)',
          backgroundColor: 'var(--color-bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-2)',
              scrollbarWidth: 'none',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
                marginRight: 'var(--space-2)',
              }}
            >
              Popular Specialties:
            </span>
            {specialties.map((item) => (
              <Link
                key={item.slug}
                to={`/doctors?specialty=${item.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-separator)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 150ms ease, border-color 150ms ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: 'var(--space-20) var(--space-4)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Get scheduled in three simple steps without phone calls or waitlists.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {steps.map((st, i) => (
              <motion.div
                key={st.step}
                initial={
                  reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }
                }
                whileInView={
                  reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  ...springPresets.smooth,
                  delay: i * 0.15,
                }}
              >
                <Card
                  elevated
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-8)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-6)',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--color-status-confirmed-bg)',
                        color: 'var(--color-brand-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {st.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {st.step}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-semibold)',
                      marginBottom: 'var(--space-2)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {st.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {st.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section
        style={{
          padding: 'var(--space-16) var(--space-4)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderTop: '1px solid var(--color-separator)',
          borderBottom: '1px solid var(--color-separator)',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={springPresets.bouncy}
          >
            <div
              style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-brand-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <Counter value={1200} suffix="+" />
            </div>
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Patients Cared For
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springPresets.bouncy, delay: 0.1 }}
          >
            <div
              style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-brand-secondary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <Counter value={48} />
            </div>
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Specialist Doctors
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springPresets.bouncy, delay: 0.2 }}
          >
            <div
              style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-brand-success)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <Counter value={4.9} decimals={1} suffix=" / 5.0" />
            </div>
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Average Rating
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: 'var(--space-20) var(--space-4)', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: 'var(--space-12) var(--space-8)',
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-separator)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Ready to book your appointment?
          </h2>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.6,
            }}
          >
            Join thousands of satisfied patients who book their clinic visits in less than two minutes.
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/doctors')}
          >
            Browse Available Doctors
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--color-separator)',
          backgroundColor: 'var(--color-bg-secondary)',
          padding: 'var(--space-10) var(--space-4)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
              AuraClinic
            </span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Precision Healthcare Management
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
            <Link to="/doctors" style={{ color: 'var(--color-text-secondary)' }}>
              Doctors
            </Link>
            <Link to="/login" style={{ color: 'var(--color-text-secondary)' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'var(--color-text-secondary)' }}>
              Register
            </Link>
            <Link to="/showcase" style={{ color: 'var(--color-text-secondary)' }}>
              UI Showcase
            </Link>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            © {new Date().getFullYear()} AuraClinic Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
