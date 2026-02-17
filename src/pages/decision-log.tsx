import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileCheck, Check, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useProject } from '@/hooks/use-projects'
import type { Decision } from '@/types'

const MOCK_DECISIONS: Decision[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Kitchen finish options',
    description: 'Select countertop and cabinet finish for kitchen.',
    status: 'pending',
    options: [
      { id: 'o1', title: 'Option A', costDelta: 0, description: 'Standard laminate' },
      { id: 'o2', title: 'Option B', costDelta: 2500, description: 'Quartz' },
    ],
    recommendedOptionId: 'o1',
  },
  {
    id: '2',
    projectId: '1',
    title: 'Exterior cladding',
    description: 'Material and color for exterior.',
    status: 'approved',
    options: [
      { id: 'o3', title: 'Timber', costDelta: 0 },
      { id: 'o4', title: 'Metal', costDelta: 4000 },
    ],
    recommendedOptionId: 'o3',
    approvedOptionId: 'o3',
    approvedAt: new Date().toISOString(),
    approvedBy: 'Client',
  },
]

export function DecisionLog() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)
  const [search, setSearch] = useState('')
  const decisions = MOCK_DECISIONS.filter(
    (d) =>
      d.projectId === projectId &&
      (!search || d.title.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Decision log</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search decisions..."
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary">Filters</Button>
          <Button>Export</Button>
        </div>
      </div>

      <p className="text-body text-muted-foreground">
        Comparison cards and versioned approvals for {project?.name ?? 'this project'}.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {decisions.map((decision) => (
          <Card
            key={decision.id}
            className="overflow-hidden transition-all duration-200 hover:shadow-card-hover"
          >
            <div className="aspect-[3/2] bg-muted shrink-0" />
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <CardTitle className="text-body font-semibold">{decision.title}</CardTitle>
              <Badge
                variant={
                  decision.status === 'approved'
                    ? 'success'
                    : decision.status === 'pending'
                      ? 'warning'
                      : 'secondary'
                }
              >
                {decision.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-small text-muted-foreground">{decision.description}</p>
              <div className="flex flex-wrap gap-2">
                {decision.options.map((opt) => (
                  <span
                    key={opt.id}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-small"
                  >
                    {opt.title}
                    {opt.costDelta != null && opt.costDelta > 0 && (
                      <span className="text-warning">+${opt.costDelta.toLocaleString()}</span>
                    )}
                    {decision.recommendedOptionId === opt.id && (
                      <ThumbsUp className="size-3 text-accent" />
                    )}
                  </span>
                ))}
              </div>
              {decision.status === 'pending' && (
                <Button size="sm" className="w-full">
                  <Check className="size-4" />
                  Approve / Request changes
                </Button>
              )}
              {decision.status === 'approved' && decision.approvedBy && (
                <p className="text-small text-muted-foreground">
                  Approved by {decision.approvedBy}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {decisions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileCheck className="size-12 text-muted-foreground mb-4" />
            <p className="text-body text-muted-foreground text-center">
              No decisions match your filters. Create a decision or adjust filters.
            </p>
            <Button className="mt-4">New decision</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
