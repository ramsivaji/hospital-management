import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { springPresets, useReducedMotion } from '@/lib/motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { DoctorCard, Doctor } from './DoctorCard'
import { Navbar } from '@/components/Navbar'

interface Specialty {
  id: number
  name: string
  slug: string
}

export const DoctorListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSpecialty = searchParams.get('specialty') || 'all'

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty)

  const reducedMotion = useReducedMotion()

  // Sync state if URL query changes
  useEffect(() => {
    const urlSpec = searchParams.get('specialty') || 'all'
    setSelectedSpecialty(urlSpec)
  }, [searchParams])

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch Specialties
  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: async () => {
      const res = await api.get('/api/v1/admin/specialties')
      return res.data
    },
  })

  // Fetch Doctors with infinite query
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['doctors', debouncedSearch, selectedSpecialty],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string | number> = { page: pageParam }
      if (debouncedSearch) params.search = debouncedSearch
      if (selectedSpecialty && selectedSpecialty !== 'all') {
        params.specialty = selectedSpecialty
      }
      const res = await api.get('/api/v1/doctors', { params })
      return res.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined
    },
  })

  const allDoctors = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => (page.results ? page.results : page)) as Doctor[]
  }, [data])

  const handleSpecialtyChange = (slug: string) => {
    setSelectedSpecialty(slug)
    if (slug === 'all') {
      searchParams.delete('specialty')
    } else {
      searchParams.set('specialty', slug)
    }
    setSearchParams(searchParams)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Find a Doctor
            </h1>
            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              Connect with top certified doctors and book immediate consultations
            </p>
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <Input
              type="search"
              placeholder="Search by doctor name, specialty, or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                fontSize: 'var(--text-md)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-lg)',
              }}
            />
          </div>

          {/* Specialty Filter Chips with Framer Motion layout animation */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
              scrollbarWidth: 'none',
            }}
          >
            <motion.button
              layout
              type="button"
              onClick={() => handleSpecialtyChange('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                border: '1px solid var(--color-separator)',
                backgroundColor:
                  selectedSpecialty === 'all'
                    ? 'var(--color-brand-primary)'
                    : 'var(--color-bg-tertiary)',
                color: selectedSpecialty === 'all' ? '#FFFFFF' : 'var(--color-text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
              }}
            >
              All Specialties
            </motion.button>

            {specialties.map((spec) => {
              const isSelected = selectedSpecialty === spec.slug
              return (
                <motion.button
                  layout
                  key={spec.slug}
                  type="button"
                  onClick={() => handleSpecialtyChange(spec.slug)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    border: '1px solid var(--color-separator)',
                    backgroundColor: isSelected
                      ? 'var(--color-brand-primary)'
                      : 'var(--color-bg-tertiary)',
                    color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {spec.name}
                </motion.button>
              )
            })}
          </div>

          {/* Doctor Grid or Loading Skeleton */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-separator)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <Skeleton width={56} height={56} circle />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Skeleton width="70%" height={20} />
                      <Skeleton width="40%" height={16} />
                    </div>
                  </div>
                  <Skeleton width="100%" height={14} style={{ marginBottom: '8px' }} />
                  <Skeleton width="85%" height={14} style={{ marginBottom: '20px' }} />
                  <Skeleton width="100%" height={36} />
                </div>
              ))}
            </div>
          ) : allDoctors.length === 0 ? (
            /* Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-16) var(--space-4)',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-separator)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: '0 auto var(--space-4)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                No doctors found
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '400px',
                  margin: '0 auto var(--space-4)',
                }}
              >
                We couldn't find any doctors matching your search criteria. Try adjusting your specialty or search term.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('')
                  handleSpecialtyChange('all')
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 'var(--space-6)',
                }}
              >
                <AnimatePresence mode="popLayout">
                  {allDoctors.map((doc) => (
                    <motion.div
                      layout
                      key={doc.id}
                      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                      transition={springPresets.smooth}
                    >
                      <DoctorCard doctor={doc} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              {hasNextPage && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                  <Button
                    variant="secondary"
                    size="md"
                    loading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    Load More Doctors
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
