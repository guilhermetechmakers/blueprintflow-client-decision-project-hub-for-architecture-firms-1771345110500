import { api } from '@/lib/api'
import type { Decision, DecisionComment, DecisionVersion } from '@/types'

export type DecisionStatusFilter = 'pending' | 'approved' | 'changes_requested'

export type DecisionListFilters = {
  status?: DecisionStatusFilter
  phase?: string
  assigneeId?: string
}

export async function fetchDecisionList(
  projectId: string,
  filters?: DecisionListFilters
): Promise<Decision[]> {
  const params = new URLSearchParams({ projectId })
  if (filters?.status) params.set('status', filters.status)
  if (filters?.phase) params.set('phase', filters.phase)
  if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId)
  const qs = params.toString()
  return api.get<Decision[]>(`/decision-log${qs ? `?${qs}` : ''}`)
}

export async function fetchDecision(decisionId: string): Promise<Decision> {
  return api.get<Decision>(`/decision-log/${decisionId}`)
}

export async function createDecision(
  projectId: string,
  body: {
    title: string
    description?: string
    phase?: string
    assigneeId?: string
    options: Array<{
      title: string
      description?: string
      costDelta?: number
      imageUrl?: string
      pdfUrl?: string
      specLink?: string
    }>
    recommendedOptionId?: string
    recommendedOptionIndex?: number
    recommendationText?: string
  }
): Promise<Decision> {
  return api.post<Decision>('/decision-log', { projectId, ...body })
}

export async function updateDecision(
  decisionId: string,
  body: Partial<Pick<Decision, 'title' | 'description' | 'phase' | 'assigneeId' | 'options' | 'recommendedOptionId' | 'recommendationText'>>
): Promise<Decision> {
  return api.patch<Decision>(`/decision-log/${decisionId}`, body)
}

export async function approveDecision(
  decisionId: string,
  optionId: string
): Promise<Decision> {
  return api.post<Decision>(`/decision-log/${decisionId}/approve`, { optionId })
}

export async function requestChangesDecision(decisionId: string, comment: string): Promise<Decision> {
  return api.post<Decision>(`/decision-log/${decisionId}/request-changes`, { comment })
}

export async function addDecisionComment(
  decisionId: string,
  body: string
): Promise<DecisionComment> {
  return api.post<DecisionComment>(`/decision-log/${decisionId}/comments`, { body })
}

export async function fetchDecisionVersions(decisionId: string): Promise<DecisionVersion[]> {
  return api.get<DecisionVersion[]>(`/decision-log/${decisionId}/versions`)
}

export async function exportDecisionPdf(decisionId: string): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers: HeadersInit = { Accept: 'application/pdf' }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/decision-log/${decisionId}/export-pdf`, { headers })
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}
