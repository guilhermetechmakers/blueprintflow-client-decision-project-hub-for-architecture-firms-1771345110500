import { Search } from 'lucide-react'
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
  placeholder = 'Search messages...',
  className,
}: SearchInMessagesProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="relative">
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
          className="pl-9 pr-4 h-10 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Search in messages"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <select
          value={contextType}
          onChange={(e) => onContextTypeChange(e.target.value as ThreadContextType | 'all')}
          className={cn(
            'flex h-9 w-full max-w-[180px] rounded-md border border-input bg-background px-3 py-1 text-body',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label="Filter by context"
        >
          {CONTEXT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
