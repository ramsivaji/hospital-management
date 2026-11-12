import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import {
  getToken,
  setToken,
  clearToken,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  StoredUser,
} from '@/lib/auth'

export interface AuthContextValue {
  user: StoredUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<StoredUser>
  register: (name: string, email: string, password: string, role: StoredUser['role']) => Promise<StoredUser>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getCurrentUser())
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Sync state on load
    const currentToken = getToken()
    const currentUser = getCurrentUser()
    setTokenState(currentToken)
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<StoredUser> => {
      const response = await api.post('/api/v1/auth/login', { email, password })
      const { user: loggedInUser, access } = response.data
      setToken(access)
      setCurrentUser(loggedInUser)
      setTokenState(access)
      setUser(loggedInUser)

      // Navigate to correct dashboard by role
      if (loggedInUser.role === 'patient') {
        navigate('/dashboard/patient')
      } else if (loggedInUser.role === 'doctor') {
        navigate('/dashboard/doctor')
      } else if (loggedInUser.role === 'admin' || loggedInUser.role === 'receptionist') {
        navigate('/dashboard/admin')
      } else {
        navigate('/')
      }

      return loggedInUser
    },
    [navigate],
  )

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: StoredUser['role'],
    ): Promise<StoredUser> => {
      const response = await api.post('/api/v1/auth/register', {
        name,
        email,
        password,
        role,
      })
      const { user: registeredUser, access } = response.data
      setToken(access)
      setCurrentUser(registeredUser)
      setTokenState(access)
      setUser(registeredUser)

      if (registeredUser.role === 'patient') {
        navigate('/dashboard/patient')
      } else if (registeredUser.role === 'doctor') {
        navigate('/dashboard/doctor')
      } else {
        navigate('/')
      }

      return registeredUser
    },
    [navigate],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/auth/logout')
    } catch {
      // Continue even if server logout fails
    }
    clearToken()
    clearCurrentUser()
    setTokenState(null)
    setUser(null)
    navigate('/login')
  }, [navigate])

  const refreshToken = useCallback(async () => {
    const response = await api.post('/api/v1/auth/refresh')
    const { access } = response.data
    setToken(access)
    setTokenState(access)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
