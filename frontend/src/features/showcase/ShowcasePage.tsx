import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import {
  Button,
  Card,
  Modal,
  Skeleton,
  Counter,
  Badge,
  Input,
  Select,
  Avatar,
  Spinner,
  Tabs,
  SlotPicker,
  TimeSlot,
} from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useTheme } from '@/hooks/useTheme'

export const ShowcasePage: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()

  // State for interactive components
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('one')
  const [inputValue, setInputValue] = useState('')
  const [counterVal, setCounterVal] = useState(128)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const sampleSlots: TimeSlot[] = [
    { start: '2026-11-20T09:00:00', end: '2026-11-20T09:30:00' },
    { start: '2026-11-20T10:15:00', end: '2026-11-20T10:45:00' },
    { start: '2026-11-20T11:30:00', end: '2026-11-20T12:00:00' },
    { start: '2026-11-20T14:00:00', end: '2026-11-20T14:30:00' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-8)',
              borderBottom: '1px solid var(--color-separator)',
              paddingBottom: 'var(--space-6)',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                UI Component Kit Showcase
              </h1>
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Interactive catalog of all Design System tokens & primitives
              </p>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={toggleTheme}
            >
              Toggle Mode: Current ({theme})
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
            {/* 1. BUTTONS */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                1. Button
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                  <Button variant="primary" size="md">Primary</Button>
                  <Button variant="secondary" size="md">Secondary</Button>
                  <Button variant="ghost" size="md">Ghost</Button>
                  <Button variant="danger" size="md">Danger</Button>
                  <Button variant="primary" size="md" loading>Loading</Button>
                  <Button variant="primary" size="md" disabled>Disabled</Button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </Card>
            </section>

            {/* 2. CARD */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                2. Card (Elevated & Interactive with hover lift)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                <Card elevated padding="md">
                  <h4 style={{ margin: '0 0 var(--space-2)' }}>Default Elevated Card</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Standard surface with subtle shadow and border.
                  </p>
                </Card>
                <Card interactive elevated padding="md" onClick={() => showToast('Card clicked!')}>
                  <h4 style={{ margin: '0 0 var(--space-2)' }}>Interactive Card (Click me)</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Lifts up by 2px on hover using spring physics.
                  </p>
                </Card>
              </div>
            </section>

            {/* 3. BADGES */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                3. Badge (Status & Brand)
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <Badge status="pending" />
                  <Badge status="confirmed" />
                  <Badge status="completed" />
                  <Badge status="cancelled" />
                  <Badge status="no-show" />
                  <Badge variant="primary">Brand Primary</Badge>
                  <Badge variant="secondary">Brand Secondary</Badge>
                </div>
              </Card>
            </section>

            {/* 4. COUNTER */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                4. Counter (Spring Bouncy Physics)
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-brand-primary)' }}>
                    <Counter value={counterVal} suffix=" patients" />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button size="sm" variant="secondary" onClick={() => setCounterVal((c) => c + 50)}>
                      +50
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setCounterVal((c) => Math.max(0, c - 50))}>
                      -50
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setCounterVal(1200)}>
                      Set to 1200
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* 5. INPUT & SELECT */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                5. Input & Select (Floating Labels)
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                  <Input
                    label="Patient Name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <Input
                    label="With Error State"
                    error="This field is required"
                    defaultValue="Invalid input"
                  />
                  <Select
                    label="Select Specialty"
                    options={[
                      { value: 'gp', label: 'General Practice' },
                      { value: 'cardio', label: 'Cardiology' },
                      { value: 'derma', label: 'Dermatology' },
                    ]}
                  />
                </div>
              </Card>
            </section>

            {/* 6. AVATAR & SPINNER */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                6. Avatar & Spinner
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Avatar name="Sarah Mitchell" size="sm" />
                    <Avatar name="James Wilson" size="md" />
                    <Avatar name="Elena Rostova" size="lg" />
                    <Avatar name="Marcus Chen" size="xl" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '1px solid var(--color-separator)', paddingLeft: 'var(--space-6)' }}>
                    <Spinner size="sm" />
                    <Spinner size="md" color="var(--color-brand-primary)" />
                    <Spinner size="lg" color="var(--color-brand-success)" />
                  </div>
                </div>
              </Card>
            </section>

            {/* 7. SKELETON */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                7. Skeleton (Shimmer Gradient Sweep)
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <Skeleton width={50} height={50} circle />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Skeleton width="40%" height={18} />
                    <Skeleton width="80%" height={14} />
                  </div>
                </div>
              </Card>
            </section>

            {/* 8. TOAST NOTIFICATIONS */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                8. Toast Notification System
              </h2>
              <Card elevated padding="md">
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <Button variant="primary" size="sm" onClick={() => showToast('Information update', 'info')}>
                    Trigger Info Toast
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => showToast('Appointment confirmed successfully!', 'success')}>
                    Trigger Success Toast
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => showToast('Action failed: slot unavailable', 'error')}>
                    Trigger Error Toast
                  </Button>
                </div>
              </Card>
            </section>

            {/* 9. TABS */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                9. Tabs (Animated Underline Indicator)
              </h2>
              <Card elevated padding="md">
                <Tabs
                  tabs={[
                    { id: 'one', label: 'All Appointments', badge: 12 },
                    { id: 'two', label: 'Confirmed Visits', badge: 8 },
                    { id: 'three', label: 'Archived' },
                  ]}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                <div style={{ padding: 'var(--space-4) 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Active tab content for: <strong>{activeTab}</strong>
                </div>
              </Card>
            </section>

            {/* 10. MODAL */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                10. Modal (Spring scale & blur backdrop)
              </h2>
              <Card elevated padding="md">
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Open Sample Modal
                </Button>
                <Modal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Design System Modal"
                >
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    This modal features backdrop blur, spring physics on enter and exit, and responds to the Escape key or backdrop clicks.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                    <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                      Close
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </Modal>
              </Card>
            </section>

            {/* 11. SLOT PICKER */}
            <section>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
                11. Slot Picker
              </h2>
              <Card elevated padding="md">
                <SlotPicker
                  slots={sampleSlots}
                  selectedSlot={selectedSlot}
                  onSelect={(s) => setSelectedSlot(s)}
                />
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
