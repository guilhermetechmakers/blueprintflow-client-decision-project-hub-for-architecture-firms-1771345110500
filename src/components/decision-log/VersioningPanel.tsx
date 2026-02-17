import { FileDown, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useDecisionVersions } from '@/hooks/use-decisions'

export interface VersioningPanelProps {
  decisionId: string
  onExportPdf: (decisionId: string) => void
  className?: string
}

export function VersioningPanel({
  decisionId,
  onExportPdf,
  className,
}: VersioningPanelProps) {
  const { data: versions, isLoading } = useDecisionVersions(decisionId)

  return (
    <section
      className={cn('space-y-3', className)}
      aria-labelledby="version-history-heading"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id="version-history-heading" className="text-h3 font-semibold flex items-center gap-2">
          <Clock className="size-4" />
          Version history
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onExportPdf(decisionId)}
          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileDown className="size-4" />
          Export PDF
        </Button>
      </div>

      {isLoading ? (
        <ul className="space-y-2 list-none p-0 m-0">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-4 w-8 rounded" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-24" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-0 list-none p-0 m-0 border border-border rounded-lg overflow-hidden">
          {(versions ?? []).length === 0 ? (
            <li className="p-4 text-small text-muted-foreground text-center">
              No version history yet.
            </li>
          ) : (
            (versions ?? []).map((v, i) => (
              <li
                key={v.id}
                className={cn(
                  'flex items-start gap-3 px-3 py-2 animate-fade-in',
                  i !== (versions?.length ?? 0) - 1 && 'border-b border-border'
                )}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-small font-medium">
                  v{v.version}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-small font-medium truncate">{v.title}</p>
                  {v.summary && (
                    <p className="text-small text-muted-foreground mt-0.5">{v.summary}</p>
                  )}
                  <p className="text-small text-muted-foreground/80 mt-0.5">
                    {new Date(v.changedAt).toLocaleString()} · {v.changedBy}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  )
}
