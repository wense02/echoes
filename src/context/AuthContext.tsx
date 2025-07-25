'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth'
import { authService } from '@/lib/auth'
import toast from 'react-hot-toast'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const user = await authService.getCurrentUser()
        dispatch({ type: 'SET_USER', payload: user })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      localStorage.removeItem('auth_token')
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { user, token } = await authService.login(credentials)
      
      localStorage.setItem('auth_token', token)
      dispatch({ type: 'SET_USER', payload: user })
      
      toast.success(`Welcome back, ${user.firstName}!`)
      return true
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : undefined
      toast.error(errorMessage || 'Login failed')
      dispatch({ type: 'SET_LOADING', payload: false })
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { user, token } = await authService.register(data)
      
      localStorage.setItem('auth_token', token)
      dispatch({ type: 'SET_USER', payload: user })
      
      toast.success(`Welcome to Forever Missed, ${user.firstName}!`)
      return true
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : undefined
      toast.error(errorMessage || 'Registration failed')
      dispatch({ type: 'SET_LOADING', payload: false })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    dispatch({ type: 'LOGOUT' })
    toast.success('Signed out successfully')
  }

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}