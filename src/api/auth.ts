import { api } from '@/lib/api'
import type { LoginSignup } from '@/types'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupPayload {
  firmName: string
  adminContact: string
  createInitialProject: boolean
}

export interface AuthResponse {
  token: string
  user: { id: string; email: string; name?: string }
}

/** Login with email/password */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', credentials)
  return res
}

/** Signup (create firm + admin) */
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/signup', payload)
  return res
}

/** Request magic link for email */
export async function requestMagicLink(email: string): Promise<{ ok: boolean }> {
  return api.post('/auth/magic-link', { email })
}

/** Validate invite token and return session or error */
export async function validateInviteToken(token: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/invite/validate', { token })
}

/** Fetch login/signup record for current user (table: login_/_signup) */
export async function getLoginSignupRecord(userId: string): Promise<LoginSignup | null> {
  try {
    const list = await api.get<LoginSignup[]>(`/login-signup?user_id=${encodeURIComponent(userId)}`)
    return list?.[0] ?? null
  } catch {
    return null
  }
}
