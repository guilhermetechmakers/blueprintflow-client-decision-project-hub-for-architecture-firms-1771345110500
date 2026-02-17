import { useQuery } from '@tanstack/react-query'
import type { User } from '@/types'

async function fetchUser(): Promise<User | null> {
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!t) return null
  return {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    role: 'pm',
  }
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
  })
  return { user, isAuthenticated: !!user, isLoading }
}
