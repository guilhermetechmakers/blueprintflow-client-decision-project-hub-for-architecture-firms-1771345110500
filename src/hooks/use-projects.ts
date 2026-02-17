import { useQuery } from '@tanstack/react-query'
import type { Project } from '@/types'

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Riverside Residence',
    status: 'active',
    clientName: 'Acme Corp',
    updatedAt: new Date().toISOString(),
    pendingApprovals: 2,
  },
  {
    id: '2',
    name: 'Downtown Office Fit-out',
    status: 'active',
    clientName: 'TechStart Inc',
    updatedAt: new Date().toISOString(),
    pendingApprovals: 0,
  },
]

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => MOCK_PROJECTS,
  })
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async (): Promise<Project | null> => {
      if (!projectId) return null
      return MOCK_PROJECTS.find((p) => p.id === projectId) ?? null
    },
    enabled: !!projectId,
  })
}
