import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, CheckSquare, HelpCircle, FileEdit } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  TaskTable,
  RfiTable,
  ChangeRequestTable,
  CreateTaskModal,
  CreateRfiModal,
  CreateChangeRequestModal,
} from '@/components/tasks-rfis-change-requests'
import type { CreateTaskFormValues, CreateRfiFormValues, CreateChangeRequestFormValues } from '@/components/tasks-rfis-change-requests'
import { useProject } from '@/hooks/use-projects'
import {
  useProjectTasks,
  useCreateProjectTask,
  useUpdateProjectTask,
  useDeleteProjectTask,
  useRfis,
  useCreateRfi,
  useUpdateRfi,
  useDeleteRfi,
  useChangeRequests,
  useCreateChangeRequest,
  useUpdateChangeRequest,
  useDeleteChangeRequest,
} from '@/hooks/use-tasks-rfis-change-requests'
import type { TaskListFilters, RfiListFilters, ChangeRequestListFilters } from '@/api/tasks-rfis-change-requests'
import type { ProjectTask, Rfi, ChangeRequest } from '@/types'
import { toast } from 'sonner'

const PAGE_TITLE = 'Tasks, RFIs & Change Requests — BlueprintFlow'

export function Tasks() {
  const { projectId } = useParams<{ projectId: string }>()
  const [taskFilters, setTaskFilters] = useState<TaskListFilters | undefined>(undefined)
  const [rfiFilters, setRfiFilters] = useState<RfiListFilters | undefined>(undefined)
  const [crFilters, setCrFilters] = useState<ChangeRequestListFilters | undefined>(undefined)

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [rfiModalOpen, setRfiModalOpen] = useState(false)
  const [crModalOpen, setCrModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null)
  const [editingRfi, setEditingRfi] = useState<Rfi | null>(null)
  const [editingCr, setEditingCr] = useState<ChangeRequest | null>(null)

  const { data: project } = useProject(projectId)
  const { tasks, isLoading: tasksLoading } = useProjectTasks(projectId, taskFilters)
  const { rfis, isLoading: rfisLoading } = useRfis(projectId, rfiFilters)
  const { changeRequests, isLoading: crLoading } = useChangeRequests(projectId, crFilters)

  const createTask = useCreateProjectTask(projectId)
  const updateTask = useUpdateProjectTask()
  const deleteTask = useDeleteProjectTask(projectId)
  const createRfi = useCreateRfi(projectId)
  const updateRfi = useUpdateRfi()
  const deleteRfi = useDeleteRfi(projectId)
  const createCr = useCreateChangeRequest(projectId)
  const updateCr = useUpdateChangeRequest()
  const deleteCr = useDeleteChangeRequest(projectId)

  useEffect(() => {
    const prev = document.title
    document.title = PAGE_TITLE
    return () => {
      document.title = prev
    }
  }, [])

  const handleTaskSubmit = (values: CreateTaskFormValues) => {
    const closeModal = () => {
      setTaskModalOpen(false)
      setEditingTask(null)
    }
    if (editingTask) {
      updateTask.mutate(
        {
          taskId: editingTask.id,
          body: {
            title: values.title,
            description: values.description,
            status: values.status,
            dueDate: values.dueDate || undefined,
            decisionId: values.decisionId || undefined,
            milestoneId: values.milestoneId || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('Task updated')
            closeModal()
          },
          onError: () => toast.error('Failed to update task'),
        }
      )
    } else {
      createTask.mutate(
        {
          title: values.title,
          description: values.description,
          status: values.status,
          dueDate: values.dueDate || undefined,
          decisionId: values.decisionId || undefined,
          milestoneId: values.milestoneId || undefined,
        },
        {
          onSuccess: () => {
            toast.success('Task created')
            closeModal()
          },
          onError: () => toast.error('Failed to create task'),
        }
      )
    }
  }

  const handleRfiSubmit = (values: CreateRfiFormValues) => {
    const closeModal = () => {
      setRfiModalOpen(false)
      setEditingRfi(null)
    }
    if (editingRfi) {
      updateRfi.mutate(
        {
          rfiId: editingRfi.id,
          body: {
            title: values.title,
            description: values.description,
            question: values.question,
            status: values.status,
            dueDate: values.dueDate || undefined,
            decisionId: values.decisionId || undefined,
            milestoneId: values.milestoneId || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('RFI updated')
            closeModal()
          },
          onError: () => toast.error('Failed to update RFI'),
        }
      )
    } else {
      createRfi.mutate(
        {
          title: values.title,
          description: values.description,
          question: values.question,
          dueDate: values.dueDate || undefined,
          decisionId: values.decisionId || undefined,
          milestoneId: values.milestoneId || undefined,
        },
        {
          onSuccess: () => {
            toast.success('RFI created')
            closeModal()
          },
          onError: () => toast.error('Failed to create RFI'),
        }
      )
    }
  }

  const handleCrSubmit = (values: CreateChangeRequestFormValues) => {
    const closeModal = () => {
      setCrModalOpen(false)
      setEditingCr(null)
    }
    if (editingCr) {
      updateCr.mutate(
        {
          changeRequestId: editingCr.id,
          body: {
            title: values.title,
            description: values.description,
            status: values.status,
            impactScope: values.impactScope,
            costImpact: values.costImpact,
            scheduleImpact: values.scheduleImpact,
            decisionId: values.decisionId || undefined,
            milestoneId: values.milestoneId || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('Change request updated')
            closeModal()
          },
          onError: () => toast.error('Failed to update change request'),
        }
      )
    } else {
      createCr.mutate(
        {
          title: values.title,
          description: values.description,
          status: values.status,
          impactScope: values.impactScope,
          costImpact: values.costImpact,
          scheduleImpact: values.scheduleImpact,
          decisionId: values.decisionId || undefined,
          milestoneId: values.milestoneId || undefined,
        },
        {
          onSuccess: () => {
            toast.success('Change request created')
            closeModal()
          },
          onError: () => toast.error('Failed to create change request'),
        }
      )
    }
  }

  const handleDeleteTask = (task: ProjectTask) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return
    deleteTask.mutate(task.id, {
      onSuccess: () => toast.success('Task deleted'),
      onError: () => toast.error('Failed to delete task'),
    })
  }

  const handleDeleteRfi = (rfi: Rfi) => {
    if (!window.confirm(`Delete RFI "${rfi.title}"?`)) return
    deleteRfi.mutate(rfi.id, {
      onSuccess: () => toast.success('RFI deleted'),
      onError: () => toast.error('Failed to delete RFI'),
    })
  }

  const handleDeleteCr = (cr: ChangeRequest) => {
    if (!window.confirm(`Delete change request "${cr.title}"?`)) return
    deleteCr.mutate(cr.id, {
      onSuccess: () => toast.success('Change request deleted'),
      onError: () => toast.error('Failed to delete change request'),
    })
  }

  const emptyTaskMessage = (
    <Card className="flex-1 flex items-center border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 w-full">
        <CheckSquare className="size-12 text-muted-foreground mb-4" />
        <p className="text-body font-medium text-foreground text-center">
          No action items yet
        </p>
        <p className="text-small text-muted-foreground text-center mt-1">
          Create a task linked to a decision or milestone to get started.
        </p>
        <Button
          className="mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => {
            setEditingTask(null)
            setTaskModalOpen(true)
          }}
        >
          <Plus className="size-4" />
          New task
        </Button>
      </CardContent>
    </Card>
  )

  const emptyRfiMessage = (
    <Card className="flex-1 flex items-center border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 w-full">
        <HelpCircle className="size-12 text-muted-foreground mb-4" />
        <p className="text-body font-medium text-foreground text-center">
          No RFIs yet
        </p>
        <p className="text-small text-muted-foreground text-center mt-1">
          Create a request for information linked to a decision or milestone.
        </p>
        <Button
          className="mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => {
            setEditingRfi(null)
            setRfiModalOpen(true)
          }}
        >
          <Plus className="size-4" />
          New RFI
        </Button>
      </CardContent>
    </Card>
  )

  const emptyCrMessage = (
    <Card className="flex-1 flex items-center border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 w-full">
        <FileEdit className="size-12 text-muted-foreground mb-4" />
        <p className="text-body font-medium text-foreground text-center">
          No change requests yet
        </p>
        <p className="text-small text-muted-foreground text-center mt-1">
          Create a formal change request linked to a decision or milestone.
        </p>
        <Button
          className="mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => {
            setEditingCr(null)
            setCrModalOpen(true)
          }}
        >
          <Plus className="size-4" />
          New change request
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col h-full min-h-0 animate-fade-in">
      <div className="flex flex-col gap-4 p-4 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-semibold">Tasks, RFIs & Change Requests</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage action items, requests for information, and formal change requests for{' '}
            {project?.name ?? 'this project'}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => {
              setEditingTask(null)
              setTaskModalOpen(true)
            }}
          >
            <Plus className="size-4" />
            New task
          </Button>
          <Button
            variant="secondary"
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => {
              setEditingRfi(null)
              setRfiModalOpen(true)
            }}
          >
            <Plus className="size-4" />
            New RFI
          </Button>
          <Button
            variant="secondary"
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => {
              setEditingCr(null)
              setCrModalOpen(true)
            }}
          >
            <Plus className="size-4" />
            New change request
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-4 overflow-auto">
        <Tabs defaultValue="tasks" className="h-full flex flex-col">
          <TabsList className="w-full sm:w-auto inline-flex">
            <TabsTrigger value="tasks" className="flex-1 sm:flex-none">
              <CheckSquare className="size-4 mr-2" />
              Tasks
              <span className="ml-2 text-muted-foreground">({tasks.length})</span>
            </TabsTrigger>
            <TabsTrigger value="rfis" className="flex-1 sm:flex-none">
              <HelpCircle className="size-4 mr-2" />
              RFIs
              <span className="ml-2 text-muted-foreground">({rfis.length})</span>
            </TabsTrigger>
            <TabsTrigger value="change-requests" className="flex-1 sm:flex-none">
              <FileEdit className="size-4 mr-2" />
              Change requests
              <span className="ml-2 text-muted-foreground">({changeRequests.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="flex-1 min-h-0 mt-4 flex flex-col">
            <TaskTable
              projectId={projectId ?? ''}
              tasks={tasks}
              isLoading={tasksLoading}
              filters={taskFilters}
              onFiltersChange={setTaskFilters}
              onEdit={(task) => {
                setEditingTask(task)
                setTaskModalOpen(true)
              }}
              onDelete={handleDeleteTask}
            />
            {!tasksLoading && tasks.length === 0 && emptyTaskMessage}
          </TabsContent>

          <TabsContent value="rfis" className="flex-1 min-h-0 mt-4 flex flex-col">
            <RfiTable
              projectId={projectId ?? ''}
              rfis={rfis}
              isLoading={rfisLoading}
              filters={rfiFilters}
              onFiltersChange={setRfiFilters}
              onEdit={(rfi) => {
                setEditingRfi(rfi)
                setRfiModalOpen(true)
              }}
              onDelete={handleDeleteRfi}
            />
            {!rfisLoading && rfis.length === 0 && emptyRfiMessage}
          </TabsContent>

          <TabsContent value="change-requests" className="flex-1 min-h-0 mt-4 flex flex-col">
            <ChangeRequestTable
              projectId={projectId ?? ''}
              changeRequests={changeRequests}
              isLoading={crLoading}
              filters={crFilters}
              onFiltersChange={setCrFilters}
              onEdit={(cr) => {
                setEditingCr(cr)
                setCrModalOpen(true)
              }}
              onDelete={handleDeleteCr}
            />
            {!crLoading && changeRequests.length === 0 && emptyCrMessage}
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskModal
        open={taskModalOpen}
        onOpenChange={(open) => {
          setTaskModalOpen(open)
          if (!open) setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        isSubmitting={createTask.isPending || updateTask.isPending}
        initialValues={editingTask}
      />
      <CreateRfiModal
        open={rfiModalOpen}
        onOpenChange={(open) => {
          setRfiModalOpen(open)
          if (!open) setEditingRfi(null)
        }}
        onSubmit={handleRfiSubmit}
        isSubmitting={createRfi.isPending || updateRfi.isPending}
        initialValues={editingRfi}
      />
      <CreateChangeRequestModal
        open={crModalOpen}
        onOpenChange={(open) => {
          setCrModalOpen(open)
          if (!open) setEditingCr(null)
        }}
        onSubmit={handleCrSubmit}
        isSubmitting={createCr.isPending || updateCr.isPending}
        initialValues={editingCr}
      />
    </div>
  )
}
