import { useParams } from 'react-router-dom'
import { MessageSquare, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProject } from '@/hooks/use-projects'

export function Messages() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h1 className="text-h1">Messages</h1>
        <p className="text-body text-muted-foreground">
          Contextual threads for {project?.name ?? 'this project'}.
        </p>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <aside className="w-72 shrink-0 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border">
            <Input placeholder="Search threads..." className="h-9" />
          </div>
          <div className="flex-1 overflow-auto p-2">
            <p className="text-small text-muted-foreground text-center py-8">
              Select a thread or start a new conversation.
            </p>
          </div>
        </aside>
        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col items-center justify-center py-16">
            <MessageSquare className="size-12 text-muted-foreground mb-4" />
            <p className="text-body text-muted-foreground text-center mb-4">
              Messages are tied to decisions, documents, or tasks. Choose a context to start.
            </p>
            <Button variant="secondary">
              <Send className="size-4" />
              New message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
