import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FileCheck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DecisionList,
  DecisionDetailPane,
  CreateDecisionModal,
} from '@/components/decision-log'
import type { CreateDecisionFormValues } from '@/components/decision-log'
import { useProject } from '@/hooks/use-projects'
import {
  useDecisions,
  useDecision,
  useCreateDecision,
} from '@/hooks/use-decisions'
import type { DecisionListFilters } from '@/api/decision-log'
import { exportDecisionPdf } from '@/api/decision-log'
import { toast } from 'sonner'

const PAGE_TITLE = 'Decision log — BlueprintFlow'

export function DecisionLog() {
  const { projectId } = useParams<{ projectId: string }>()
  const [filters, setFilters] = useState<DecisionListFilters | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: project } = useProject(projectId)
  const { decisions, isLoading } = useDecisions(projectId, filters)
  const { data: selectedDecision, isLoading: detailLoading } = useDecision(selectedId)
  const createMutation = useCreateDecision(projectId)

  useEffect(() => {
    const prev = document.title
    document.title = PAGE_TITLE
    return () => {
      document.title = prev
    }
  }, [])

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return decisions
    const q = searchQuery.toLowerCase()
    return decisions.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description?.toLowerCase().includes(q) ?? false)
    )
  }, [decisions, searchQuery])

  const handleExportPdf = (decisionId: string) => {
    exportDecisionPdf(decisionId)
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `decision-${decisionId}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('PDF downloaded')
      })
      .catch(() => toast.error('Export failed'))
  }

  const handleCreateSubmit = (values: CreateDecisionFormValues) => {
    const options = values.options.map((o) => ({
      title: o.title,
      description: o.description,
      costDelta: o.costDelta,
      imageUrl: o.imageUrl || undefined,
      pdfUrl: o.pdfUrl || undefined,
      specLink: o.specLink || undefined,
    }))
    createMutation.mutate(
      {
        title: values.title,
        description: values.description,
        phase: values.phase,
        assigneeId: values.assigneeId,
        options,
        recommendedOptionIndex: values.recommendedOptionIndex,
        recommendationText: values.recommendationText,
      },
      {
        onSuccess: () => toast.success('Decision created'),
        onError: () => toast.error('Failed to create decision'),
      }
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 animate-fade-in">
      <div className="flex flex-col gap-4 p-4 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-semibold">Decision log</h1>
          <p className="text-body text-muted-foreground mt-1">
            Compare options, get client approval, and keep a versioned record for{' '}
            {project?.name ?? 'this project'}.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="size-4" />
          New decision
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-0 p-4 gap-4">
        <div className="min-w-0 min-h-0 flex flex-col">
          <DecisionList
            decisions={filteredBySearch}
            isLoading={isLoading}
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedId={selectedId}
            onSelectDecision={setSelectedId}
            onApproveClick={(d) => setSelectedId(d.id)}
          />

          {!isLoading && filteredBySearch.length === 0 && (
            <Card className="mt-4 flex-1 flex items-center">
              <CardContent className="flex flex-col items-center justify-center py-12 w-full">
                <FileCheck className="size-12 text-muted-foreground mb-4" />
                <p className="text-body font-medium text-foreground text-center">
                  No decisions match your filters
                </p>
                <p className="text-small text-muted-foreground text-center mt-1">
                  Create a decision or adjust filters to get started.
                </p>
                <Button
                  className="mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Plus className="size-4" />
                  New decision
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="hidden lg:block min-h-0 min-w-0">
          <DecisionDetailPane
            decision={selectedDecision ?? null}
            isLoading={detailLoading && !!selectedId}
            projectId={projectId}
            onExportPdf={handleExportPdf}
          />
        </div>
      </div>

      {/* Mobile detail: show as overlay or full-width when selected */}
      {selectedId && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-auto">
          <div className="p-4 pb-8">
            <Button
              variant="secondary"
              size="sm"
              className="mb-2"
              onClick={() => setSelectedId(null)}
            >
              Back to list
            </Button>
            <DecisionDetailPane
              decision={selectedDecision ?? null}
              isLoading={detailLoading}
              projectId={projectId}
              onExportPdf={handleExportPdf}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}

      <CreateDecisionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateSubmit}
        isSubmitting={createMutation.isPending}
        projectId={projectId}
      />
    </div>
  )
}
