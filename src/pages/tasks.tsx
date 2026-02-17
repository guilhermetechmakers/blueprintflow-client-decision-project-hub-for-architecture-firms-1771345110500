import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const MOCK_COLUMNS = [
  { id: 'todo', title: 'To do', count: 2 },
  { id: 'progress', title: 'In progress', count: 1 },
  { id: 'done', title: 'Done', count: 3 },
]

export function Tasks() {
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Tasks & change requests</h1>
        <Button>
          <Plus className="size-4" />
          New task
        </Button>
      </div>

      <p className="text-body text-muted-foreground">
        Kanban board for action items and change requests. Project: {projectId}
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {MOCK_COLUMNS.map((col) => (
          <Card key={col.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-h3 font-semibold">{col.title}</h3>
              <Badge variant="secondary">{col.count}</Badge>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              {col.id === 'todo' && (
                <>
                  <div className="rounded-md border border-border p-3 text-body">
                    Review kitchen drawings
                  </div>
                  <div className="rounded-md border border-border p-3 text-body">
                    Send client options for finish
                  </div>
                </>
              )}
              {col.id === 'progress' && (
                <div className="rounded-md border border-border p-3 text-body">
                  Update DD set per feedback
                </div>
              )}
              {col.id === 'done' && (
                <>
                  <div className="rounded-md border border-border p-3 text-body text-muted-foreground">
                    SD approval
                  </div>
                  <div className="rounded-md border border-border p-3 text-body text-muted-foreground">
                    Concept presentation
                  </div>
                  <div className="rounded-md border border-border p-3 text-body text-muted-foreground">
                    Kickoff meeting
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
