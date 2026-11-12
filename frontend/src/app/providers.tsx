import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { LenisProvider } from './LenisProvider'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
})

export interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers
