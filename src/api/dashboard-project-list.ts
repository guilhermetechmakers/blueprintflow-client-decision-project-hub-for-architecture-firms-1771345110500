import { api } from '@/lib/api'
import type { DashboardProjectListRecord } from '@/types'

export type DashboardProjectListFilters = {
  role?: 'owner' | 'member' | 'client'
  status?: 'active' | 'archived'
  dueSoon?: boolean
}

export async function fetchDashboardProjectList(
  _filters?: DashboardProjectListFilters
): Promise<DashboardProjectListRecord[]> {
  const params = new URLSearchParams()
  if (_filters?.role) params.set('role', _filters.role)
  if (_filters?.status) params.set('status', _filters.status)
  if (_filters?.dueSoon) params.set('due_soon', 'true')
  const qs = params.toString()
  return api.get<DashboardProjectListRecord[]>(
    `/dashboard-project-list${qs ? `?${qs}` : ''}`
  )
}

export async function createDashboardProjectList(
  body: Pick<DashboardProjectListRecord, 'title' | 'description' | 'status'>
): Promise<DashboardProjectListRecord> {
  return api.post<DashboardProjectListRecord>('/dashboard-project-list', body)
}
