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
  password: string
  createInitialProject?: boolean
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

/** Request password reset link (POST /api/auth/forgot-password or similar) */
export async function requestPasswordReset(email: string): Promise<{ ok: boolean; message?: string }> {
  return api.post<{ ok: boolean; message?: string }>('/auth/forgot-password', { email })
}

/** Reset password with token from email link (POST /api/auth/reset-password) */
export async function resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/reset-password', { token, newPassword })
}

/** SSO: get redirect URL for provider (backend returns URL or initiates redirect) */
export async function getSsoLoginUrl(provider: 'google' | 'microsoft'): Promise<{ url: string }> {
  const res = await api.get<{ url: string }>(`/auth/sso/${provider}`)
  return res
}

/** SSO callback is handled by backend; client redirects to /dashboard after callback */
export async function ssoCallback(code: string, state?: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/sso/callback', { code, state })
}

/** Accept client invitation (POST /api/auth/invite/accept) */
export async function acceptInvite(token: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/invite/accept', { token })
}

/** Request magic link for email */
export async function requestMagicLink(email: string): Promise<{ ok: boolean }> {
  return api.post('/auth/magic-link', { email })
}

/** Validate invite token and return session or error (alias for acceptInvite for backward compat) */
export async function validateInviteToken(token: string): Promise<AuthResponse> {
  return acceptInvite(token)
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
