import { api } from '@/lib/api'
import type { ProjectTask, Rfi, ChangeRequest } from '@/types'

export type ProjectTaskStatusFilter = 'todo' | 'in_progress' | 'done'
export type RfiStatusFilter = 'open' | 'answered' | 'closed'
export type ChangeRequestStatusFilter = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'

export type TaskListFilters = {
  status?: ProjectTaskStatusFilter
  decisionId?: string
  milestoneId?: string
}

export type RfiListFilters = {
  status?: RfiStatusFilter
  decisionId?: string
  milestoneId?: string
}

export type ChangeRequestListFilters = {
  status?: ChangeRequestStatusFilter
  decisionId?: string
  milestoneId?: string
}

export async function fetchProjectTasks(
  projectId: string,
  filters?: TaskListFilters
): Promise<ProjectTask[]> {
  const params = new URLSearchParams({ projectId })
  if (filters?.status) params.set('status', filters.status)
  if (filters?.decisionId) params.set('decisionId', filters.decisionId)
  if (filters?.milestoneId) params.set('milestoneId', filters.milestoneId)
  const qs = params.toString()
  return api.get<ProjectTask[]>(`/project-tasks${qs ? `?${qs}` : ''}`)
}

export async function fetchProjectTask(taskId: string): Promise<ProjectTask> {
  return api.get<ProjectTask>(`/project-tasks/${taskId}`)
}

export async function createProjectTask(
  projectId: string,
  body: {
    title: string
    description?: string
    status?: ProjectTask['status']
    assigneeId?: string
    dueDate?: string
    decisionId?: string
    milestoneId?: string
  }
): Promise<ProjectTask> {
  return api.post<ProjectTask>('/project-tasks', { projectId, ...body })
}

export async function updateProjectTask(
  taskId: string,
  body: Partial<Pick<ProjectTask, 'title' | 'description' | 'status' | 'assigneeId' | 'dueDate' | 'decisionId' | 'milestoneId'>>
): Promise<ProjectTask> {
  return api.patch<ProjectTask>(`/project-tasks/${taskId}`, body)
}

export async function deleteProjectTask(taskId: string): Promise<void> {
  return api.delete(`/project-tasks/${taskId}`)
}

export async function fetchRfis(
  projectId: string,
  filters?: RfiListFilters
): Promise<Rfi[]> {
  const params = new URLSearchParams({ projectId })
  if (filters?.status) params.set('status', filters.status)
  if (filters?.decisionId) params.set('decisionId', filters.decisionId)
  if (filters?.milestoneId) params.set('milestoneId', filters.milestoneId)
  const qs = params.toString()
  return api.get<Rfi[]>(`/rfis${qs ? `?${qs}` : ''}`)
}

export async function fetchRfi(rfiId: string): Promise<Rfi> {
  return api.get<Rfi>(`/rfis/${rfiId}`)
}

export async function createRfi(
  projectId: string,
  body: {
    title: string
    description?: string
    question: string
    decisionId?: string
    milestoneId?: string
    dueDate?: string
  }
): Promise<Rfi> {
  return api.post<Rfi>('/rfis', { projectId, ...body })
}

export async function updateRfi(
  rfiId: string,
  body: Partial<Pick<Rfi, 'title' | 'description' | 'status' | 'question' | 'response' | 'decisionId' | 'milestoneId' | 'dueDate'>>
): Promise<Rfi> {
  return api.patch<Rfi>(`/rfis/${rfiId}`, body)
}

export async function deleteRfi(rfiId: string): Promise<void> {
  return api.delete(`/rfis/${rfiId}`)
}

export async function fetchChangeRequests(
  projectId: string,
  filters?: ChangeRequestListFilters
): Promise<ChangeRequest[]> {
  const params = new URLSearchParams({ projectId })
  if (filters?.status) params.set('status', filters.status)
  if (filters?.decisionId) params.set('decisionId', filters.decisionId)
  if (filters?.milestoneId) params.set('milestoneId', filters.milestoneId)
  const qs = params.toString()
  return api.get<ChangeRequest[]>(`/change-requests${qs ? `?${qs}` : ''}`)
}

export async function fetchChangeRequest(changeRequestId: string): Promise<ChangeRequest> {
  return api.get<ChangeRequest>(`/change-requests/${changeRequestId}`)
}

export async function createChangeRequest(
  projectId: string,
  body: {
    title: string
    description?: string
    status?: ChangeRequest['status']
    impactScope?: string
    costImpact?: number
    scheduleImpact?: string
    decisionId?: string
    milestoneId?: string
  }
): Promise<ChangeRequest> {
  return api.post<ChangeRequest>('/change-requests', { projectId, ...body })
}

export async function updateChangeRequest(
  changeRequestId: string,
  body: Partial<Pick<ChangeRequest, 'title' | 'description' | 'status' | 'impactScope' | 'costImpact' | 'scheduleImpact' | 'decisionId' | 'milestoneId'>>
): Promise<ChangeRequest> {
  return api.patch<ChangeRequest>(`/change-requests/${changeRequestId}`, body)
}

export async function deleteChangeRequest(changeRequestId: string): Promise<void> {
  return api.delete(`/change-requests/${changeRequestId}`)
}
