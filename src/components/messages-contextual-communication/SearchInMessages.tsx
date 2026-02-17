import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ThreadContextType } from '@/types'

export interface SearchInMessagesProps {
  keyword: string
  onKeywordChange: (value: string) => void
  contextType: ThreadContextType | 'all'
  onContextTypeChange: (value: ThreadContextType | 'all') => void
  onSearch?: () => void
  placeholder?: string
  className?: string
}

const CONTEXT_OPTIONS: { value: ThreadContextType | 'all'; label: string }[] = [
  { value: 'all', label: 'All contexts' },
  { value: 'decision', label: 'Decision' },
  { value: 'document', label: 'Document' },
  { value: 'task', label: 'Task' },
  { value: 'project', label: 'Project' },
]

export function SearchInMessages({
  keyword,
  onKeywordChange,
  contextType,
  onContextTypeChange,
  onSearch,
  placeholder = 'Search by keyword...',
  className,
}: SearchInMessagesProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-2 sm:items-center', className)}>
      <div className="relative flex-1 min-w-0">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden
        />
        <Input
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
          placeholder={placeholder}
          className="pl-9 pr-4 h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search in messages by keyword"
        />
      </div>
      <div className="flex gap-2 flex-wrap items-center shrink-0">
        <div className="flex items-center gap-1.5">
          <Filter className="size-4 text-muted-foreground shrink-0" aria-hidden />
          <select
            value={contextType}
            onChange={(e) => onContextTypeChange(e.target.value as ThreadContextType | 'all')}
            className={cn(
              'h-9 min-w-[140px] max-w-[180px] rounded-md border border-input bg-background px-3 py-1.5 text-body',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label="Filter by context (decision, document, task, project)"
          >
            {CONTEXT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {onSearch && (
          <Button
            type="button"
            variant="secondary"
            size="default"
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={onSearch}
          >
            Search
          </Button>
        )}
      </div>
    </div>
  )
}
