import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Decision, DecisionVersion } from '@/types'
import type { DecisionListFilters } from '@/api/decision-log'
import {
  fetchDecisionList,
  fetchDecision,
  createDecision,
  updateDecision,
  approveDecision,
  requestChangesDecision,
  addDecisionComment,
  fetchDecisionVersions,
} from '@/api/decision-log'

const MOCK_DECISIONS: Decision[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Kitchen finish options',
    description: 'Select countertop and cabinet finish for kitchen.',
    status: 'pending',
    phase: 'Design Development',
    assigneeId: 'u1',
    assigneeName: 'Jane Smith',
    options: [
      {
        id: 'o1',
        title: 'Option A',
        costDelta: 0,
        description: 'Standard laminate',
        imageUrl: undefined,
      },
      {
        id: 'o2',
        title: 'Option B',
        costDelta: 2500,
        description: 'Quartz',
        imageUrl: undefined,
      },
    ],
    recommendedOptionId: 'o1',
    recommendationText: 'Option A balances cost and durability for this scope.',
    comments: [
      {
        id: 'c1',
        decisionId: '1',
        authorId: 'u2',
        authorName: 'Client',
        body: 'Can we see a sample of Option B?',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    versions: [
      {
        id: 'v1',
        decisionId: '1',
        version: 1,
        title: 'Kitchen finish options',
        changedAt: new Date(Date.now() - 172800000).toISOString(),
        changedBy: 'Jane Smith',
        summary: 'Initial options added',
      },
    ],
  },
  {
    id: '2',
    projectId: '1',
    title: 'Exterior cladding',
    description: 'Material and color for exterior.',
    status: 'approved',
    phase: 'Schematic Design',
    assigneeId: 'u1',
    assigneeName: 'Jane Smith',
    options: [
      { id: 'o3', title: 'Timber', costDelta: 0, description: 'Natural timber' },
      { id: 'o4', title: 'Metal', costDelta: 4000, description: 'Metal panels' },
    ],
    recommendedOptionId: 'o3',
    recommendationText: 'Timber aligns with project aesthetic and budget.',
    approvedOptionId: 'o3',
    approvedAt: new Date().toISOString(),
    approvedBy: 'Client',
    comments: [],
    versions: [
      {
        id: 'v2',
        decisionId: '2',
        version: 1,
        title: 'Exterior cladding',
        changedAt: new Date(Date.now() - 259200000).toISOString(),
        changedBy: 'Jane Smith',
        summary: 'Created',
      },
      {
        id: 'v3',
        decisionId: '2',
        version: 2,
        title: 'Exterior cladding',
        changedAt: new Date().toISOString(),
        changedBy: 'Client',
        summary: 'Approved Option A',
      },
    ],
  },
  {
    id: '3',
    projectId: '1',
    title: 'Flooring type',
    description: 'Main floor material selection.',
    status: 'changes_requested',
    phase: 'Design Development',
    assigneeId: 'u2',
    assigneeName: 'John Doe',
    options: [
      { id: 'o5', title: 'Hardwood', costDelta: 0 },
      { id: 'o6', title: 'Engineered', costDelta: -500 },
      { id: 'o7', title: 'Tile', costDelta: 1200 },
    ],
    recommendedOptionId: 'o5',
    recommendationText: 'Hardwood for consistency with the rest of the home.',
    comments: [
      {
        id: 'c2',
        decisionId: '3',
        authorId: 'u3',
        authorName: 'Client',
        body: 'We prefer engineered for moisture resistance. Please update costs.',
        createdAt: new Date().toISOString(),
      },
    ],
    versions: [],
  },
]

function filterDecisions(
  decisions: Decision[],
  projectId: string,
  filters?: DecisionListFilters
): Decision[] {
  let result = decisions.filter((d) => d.projectId === projectId)
  if (!filters) return result
  if (filters.status) result = result.filter((d) => d.status === filters.status)
  if (filters.phase) result = result.filter((d) => d.phase === filters.phase)
  if (filters.assigneeId)
    result = result.filter((d) => d.assigneeId === filters.assigneeId)
  return result
}

const QUERY_KEY = 'decision-log'

export function useDecisions(projectId: string | undefined, filters?: DecisionListFilters) {
  const query = useQuery({
    queryKey: [QUERY_KEY, projectId, filters],
    queryFn: async (): Promise<Decision[]> => {
      if (!projectId) return []
      try {
        return await fetchDecisionList(projectId, filters)
      } catch {
        return filterDecisions(MOCK_DECISIONS, projectId, filters)
      }
    },
    enabled: !!projectId,
  })
  const decisions = query.data ?? []
  return { ...query, decisions }
}

export function useDecision(decisionId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, decisionId],
    queryFn: async (): Promise<Decision | null> => {
      if (!decisionId) return null
      try {
        return await fetchDecision(decisionId)
      } catch {
        return MOCK_DECISIONS.find((d) => d.id === decisionId) ?? null
      }
    },
    enabled: !!decisionId,
  })
}

export function useDecisionVersions(decisionId: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, decisionId, 'versions'],
    queryFn: async (): Promise<DecisionVersion[]> => {
      if (!decisionId) return []
      try {
        return await fetchDecisionVersions(decisionId)
      } catch {
        const d = MOCK_DECISIONS.find((x) => x.id === decisionId)
        return d?.versions ?? []
      }
    },
    enabled: !!decisionId,
  })
}

export function useCreateDecision(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof createDecision>[1]) =>
      createDecision(projectId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, projectId] })
    },
  })
}

export function useUpdateDecision() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ decisionId, body }: { decisionId: string; body: Parameters<typeof updateDecision>[1] }) =>
      updateDecision(decisionId, body),
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: [QUERY_KEY] })
      client.setQueryData([QUERY_KEY, data.id], data)
    },
  })
}

export function useApproveDecision() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ decisionId, optionId }: { decisionId: string; optionId: string }) =>
      approveDecision(decisionId, optionId),
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: [QUERY_KEY] })
      client.setQueryData([QUERY_KEY, data.id], data)
    },
  })
}

export function useRequestChangesDecision() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ decisionId, comment }: { decisionId: string; comment: string }) =>
      requestChangesDecision(decisionId, comment),
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: [QUERY_KEY] })
      client.setQueryData([QUERY_KEY, data.id], data)
    },
  })
}

export function useAddDecisionComment(decisionId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: string) => addDecisionComment(decisionId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEY, decisionId] })
    },
  })
}
