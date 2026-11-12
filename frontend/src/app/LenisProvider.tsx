import React, { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize smooth scroll in browser environment
    if (typeof window === 'undefined') return

    // Skip Lenis if prefers-reduced-motion is true
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReducedMotion) return

    let lenis: Lenis | null = null
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      let animationFrameId: number

      function raf(time: number) {
        lenis?.raf(time)
        animationFrameId = requestAnimationFrame(raf)
      }

      animationFrameId = requestAnimationFrame(raf)

      return () => {
        cancelAnimationFrame(animationFrameId)
        lenis?.destroy()
      }
    } catch (e) {
      console.warn('Lenis initialization skipped:', e)
    }
  }, [])

  return <>{children}</>
}
