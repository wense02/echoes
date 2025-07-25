export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  plan: 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL' | 'LIFETIME'
  planExpiresAt?: Date
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}