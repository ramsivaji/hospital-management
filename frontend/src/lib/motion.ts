import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

export const springPresets = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30, mass: 1 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 1 },
  gentle: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 1 },
  bouncy: { type: 'spring' as const, stiffness: 500, damping: 20, mass: 1 },
}

export const spring = springPresets

export const stagger = {
  sm: 0.04,
  md: 0.07,
  lg: 0.12,
}

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}

export function getTransition(preset: keyof typeof springPresets, reducedMotion: boolean) {
  if (reducedMotion) return { duration: 0 }
  return springPresets[preset]
}

export function staggerContainer(delayChildren = stagger.md, staggerChildren = stagger.md) {
  return {
    hidden: {},
    show: {
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  }
}

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: springPresets.gentle,
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: springPresets.smooth,
  },
}
