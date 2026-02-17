import { useQuery } from '@tanstack/react-query'
import type { Project } from '@/types'

export type ProjectListRole = 'owner' | 'member' | 'client'
export type ProjectListStatusFilter = 'active' | 'archived'

export type DashboardProjectListFilters = {
  role?: ProjectListRole
  status?: ProjectListStatusFilter
  dueSoon?: boolean
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Riverside Residence',
    status: 'active',
    clientName: 'Acme Corp',
    updatedAt: new Date().toISOString(),
    pendingApprovals: 2,
    phase: 'Design Development',
    percentComplete: 65,
    role: 'owner',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Downtown Office Fit-out',
    status: 'active',
    clientName: 'TechStart Inc',
    updatedAt: new Date().toISOString(),
    pendingApprovals: 0,
    phase: 'Schematic Design',
    percentComplete: 30,
    role: 'member',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Warehouse Conversion',
    status: 'active',
    clientName: 'LogiCo',
    updatedAt: new Date().toISOString(),
    pendingApprovals: 1,
    phase: 'Construction Documents',
    percentComplete: 85,
    role: 'client',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Historic Renovation',
    status: 'archived',
    clientName: 'Heritage Trust',
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    pendingApprovals: 0,
    phase: 'Complete',
    percentComplete: 100,
    role: 'owner',
  },
]

const DUE_SOON_DAYS = 7

function filterProjects(
  projects: Project[],
  filters: DashboardProjectListFilters | undefined
): Project[] {
  if (!filters) return projects
  let result = [...projects]
  if (filters.role) {
    result = result.filter((p) => p.role === filters.role)
  }
  if (filters.status) {
    result = result.filter((p) => p.status === filters.status)
  }
  if (filters.dueSoon) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() + DUE_SOON_DAYS)
    result = result.filter((p) => {
      if (!p.dueDate) return false
      return new Date(p.dueDate) <= cutoff && new Date(p.dueDate) >= new Date()
    })
  }
  return result
}

export function useDashboardProjectList(filters?: DashboardProjectListFilters) {
  const query = useQuery({
    queryKey: ['dashboard-project-list', filters],
    queryFn: async (): Promise<Project[]> => {
      await new Promise((r) => setTimeout(r, 300))
      return MOCK_PROJECTS
    },
  })
  const filtered =
    query.data !== undefined
      ? filterProjects(query.data, filters)
      : undefined
  return {
    ...query,
    data: filtered,
    projects: filtered,
  }
}
