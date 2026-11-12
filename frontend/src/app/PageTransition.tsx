import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, Outlet } from 'react-router-dom'
import { springPresets, useReducedMotion } from '@/lib/motion'

export const PageTransition: React.FC = () => {
  const location = useLocation()
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={
          reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, x: -16 }
        }
        animate={
          reducedMotion
            ? { opacity: 1 }
            : { opacity: 1, x: 0 }
        }
        exit={
          reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, x: 16 }
        }
        transition={reducedMotion ? { duration: 0 } : springPresets.smooth}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
