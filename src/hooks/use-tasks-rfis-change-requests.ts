import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProjectTask, Rfi, ChangeRequest } from '@/types'
import type {
  TaskListFilters,
  RfiListFilters,
  ChangeRequestListFilters,
} from '@/api/tasks-rfis-change-requests'
import {
  fetchProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
  fetchRfis,
  createRfi,
  updateRfi,
  deleteRfi,
  fetchChangeRequests,
  createChangeRequest,
  updateChangeRequest,
  deleteChangeRequest,
} from '@/api/tasks-rfis-change-requests'

const MOCK_TASKS: ProjectTask[] = [
  {
    id: 't1',
    projectId: '1',
    title: 'Review kitchen drawings',
    status: 'todo',
    decisionId: '1',
    decisionTitle: 'Kitchen finish options',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't2',
    projectId: '1',
    title: 'Send client options for finish',
    status: 'todo',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't3',
    projectId: '1',
    title: 'Update DD set per feedback',
    status: 'in_progress',
    assigneeName: 'Jane Smith',
    milestoneId: 'm1',
    milestoneTitle: 'DD submission',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't4',
    projectId: '1',
    title: 'SD approval',
    status: 'done',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't5',
    projectId: '1',
    title: 'Concept presentation',
    status: 'done',
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_RFIS: Rfi[] = [
  {
    id: 'r1',
    projectId: '1',
    title: 'Cladding attachment details',
    question: 'What is the recommended attachment system for the timber cladding?',
    status: 'open',
    decisionId: '2',
    decisionTitle: 'Exterior cladding',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'r2',
    projectId: '1',
    title: 'Flooring transition',
    question: 'Transition detail between hardwood and tile in kitchen?',
    status: 'answered',
    response: 'Use Schluter strip; spec to follow.',
    answeredAt: new Date().toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: 'cr1',
    projectId: '1',
    title: 'Add powder room to scope',
    description: 'Client requested additional powder room on main floor.',
    status: 'submitted',
    impactScope: 'MEP, finishes, minor layout',
    costImpact: 8500,
    scheduleImpact: '2 weeks',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    decisionId: '1',
    decisionTitle: 'Kitchen finish options',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cr2',
    projectId: '1',
    title: 'Exterior material swap',
    description: 'Switch from Option A to metal panels per decision log.',
    status: 'approved',
    impactScope: 'Façade',
    costImpact: 4000,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function filterTasks(
  tasks: ProjectTask[],
  projectId: string,
  filters?: TaskListFilters
): ProjectTask[] {
  let result = tasks.filter((t) => t.projectId === projectId)
  if (!filters) return result
  if (filters.status) result = result.filter((t) => t.status === filters.status)
  if (filters.decisionId) result = result.filter((t) => t.decisionId === filters.decisionId)
  if (filters.milestoneId) result = result.filter((t) => t.milestoneId === filters.milestoneId)
  return result
}

function filterRfis(
  rfis: Rfi[],
  projectId: string,
  filters?: RfiListFilters
): Rfi[] {
  let result = rfis.filter((r) => r.projectId === projectId)
  if (!filters) return result
  if (filters.status) result = result.filter((r) => r.status === filters.status)
  if (filters.decisionId) result = result.filter((r) => r.decisionId === filters.decisionId)
  if (filters.milestoneId) result = result.filter((r) => r.milestoneId === filters.milestoneId)
  return result
}

function filterChangeRequests(
  list: ChangeRequest[],
  projectId: string,
  filters?: ChangeRequestListFilters
): ChangeRequest[] {
  let result = list.filter((c) => c.projectId === projectId)
  if (!filters) return result
  if (filters.status) result = result.filter((c) => c.status === filters.status)
  if (filters.decisionId) result = result.filter((c) => c.decisionId === filters.decisionId)
  if (filters.milestoneId) result = result.filter((c) => c.milestoneId === filters.milestoneId)
  return result
}

const TASKS_KEY = 'project-tasks'
const RFIS_KEY = 'rfis'
const CHANGE_REQUESTS_KEY = 'change-requests'

export function useProjectTasks(projectId: string | undefined, filters?: TaskListFilters) {
  const query = useQuery({
    queryKey: [TASKS_KEY, projectId, filters],
    queryFn: async (): Promise<ProjectTask[]> => {
      if (!projectId) return []
      try {
        return await fetchProjectTasks(projectId, filters)
      } catch {
        return filterTasks(MOCK_TASKS, projectId, filters)
      }
    },
    enabled: !!projectId,
  })
  const tasks = query.data ?? []
  return { ...query, tasks }
}

export function useCreateProjectTask(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof createProjectTask>[1]) =>
      createProjectTask(projectId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TASKS_KEY, projectId] })
    },
  })
}

export function useUpdateProjectTask() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      body,
    }: {
      taskId: string
      body: Parameters<typeof updateProjectTask>[1]
    }) => updateProjectTask(taskId, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

export function useDeleteProjectTask(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (taskId: string) => deleteProjectTask(taskId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [TASKS_KEY, projectId] })
    },
  })
}

export function useRfis(projectId: string | undefined, filters?: RfiListFilters) {
  const query = useQuery({
    queryKey: [RFIS_KEY, projectId, filters],
    queryFn: async (): Promise<Rfi[]> => {
      if (!projectId) return []
      try {
        return await fetchRfis(projectId, filters)
      } catch {
        return filterRfis(MOCK_RFIS, projectId, filters)
      }
    },
    enabled: !!projectId,
  })
  const rfis = query.data ?? []
  return { ...query, rfis }
}

export function useCreateRfi(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof createRfi>[1]) => createRfi(projectId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [RFIS_KEY, projectId] })
    },
  })
}

export function useUpdateRfi() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      rfiId,
      body,
    }: {
      rfiId: string
      body: Parameters<typeof updateRfi>[1]
    }) => updateRfi(rfiId, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [RFIS_KEY] })
    },
  })
}

export function useDeleteRfi(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (rfiId: string) => deleteRfi(rfiId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [RFIS_KEY, projectId] })
    },
  })
}

export function useChangeRequests(
  projectId: string | undefined,
  filters?: ChangeRequestListFilters
) {
  const query = useQuery({
    queryKey: [CHANGE_REQUESTS_KEY, projectId, filters],
    queryFn: async (): Promise<ChangeRequest[]> => {
      if (!projectId) return []
      try {
        return await fetchChangeRequests(projectId, filters)
      } catch {
        return filterChangeRequests(MOCK_CHANGE_REQUESTS, projectId, filters)
      }
    },
    enabled: !!projectId,
  })
  const changeRequests = query.data ?? []
  return { ...query, changeRequests }
}

export function useCreateChangeRequest(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof createChangeRequest>[1]) =>
      createChangeRequest(projectId!, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [CHANGE_REQUESTS_KEY, projectId] })
    },
  })
}

export function useUpdateChangeRequest() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      changeRequestId,
      body,
    }: {
      changeRequestId: string
      body: Parameters<typeof updateChangeRequest>[1]
    }) => updateChangeRequest(changeRequestId, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [CHANGE_REQUESTS_KEY] })
    },
  })
}

export function useDeleteChangeRequest(projectId: string | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (changeRequestId: string) => deleteChangeRequest(changeRequestId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [CHANGE_REQUESTS_KEY, projectId] })
    },
  })
}
