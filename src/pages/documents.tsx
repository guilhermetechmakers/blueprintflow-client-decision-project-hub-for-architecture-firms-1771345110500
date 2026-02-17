import { useParams } from 'react-router-dom'
import { FileText, Folder, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/use-projects'

export function Documents() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Documents</h1>
        <Button>
          <Upload className="size-4" />
          Upload
        </Button>
      </div>

      <p className="text-body text-muted-foreground">
        Drawings, specs, and contracts for {project?.name ?? 'this project'}.
      </p>

      <div className="flex gap-6">
        <aside className="w-56 shrink-0 space-y-1">
          <p className="text-small font-medium text-muted-foreground px-2">Folders</p>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-body hover:bg-accent/10">
            <Folder className="size-4" />
            All files
          </button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-body hover:bg-accent/10">
            <Folder className="size-4" />
            Drawings
          </button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-body hover:bg-accent/10">
            <Folder className="size-4" />
            Specs
          </button>
        </aside>
        <div className="flex-1">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="size-12 text-muted-foreground mb-4" />
              <p className="text-body text-muted-foreground text-center mb-4">
                No documents yet. Upload drawings or specs to get started.
              </p>
              <Button>
                <Upload className="size-4" />
                Upload file
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
