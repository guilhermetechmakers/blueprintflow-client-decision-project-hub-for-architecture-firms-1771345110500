import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import {
  QuickFilters,
  ProjectTilesList,
  ActivityFeed,
  CreateProjectCTA,
} from '@/components/dashboard-project-list'
import { Input } from '@/components/ui/input'
import { useDashboardProjectList } from '@/hooks/use-dashboard-project-list'
import { useActivityFeed } from '@/hooks/use-activity-feed'
import type { DashboardProjectListFilters } from '@/hooks/use-dashboard-project-list'

const PAGE_TITLE = 'Project list — BlueprintFlow'

export default function DashboardProjectList() {
  const [filters, setFilters] = useState<DashboardProjectListFilters | undefined>(undefined)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''

  const setSearchQuery = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value.trim())
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    const prev = document.title
    document.title = PAGE_TITLE
    return () => {
      document.title = prev
    }
  }, [])

  const { projects, isLoading: projectsLoading } = useDashboardProjectList(filters)
  const { data: activityItems, isLoading: activityLoading } = useActivityFeed()

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim() || !projects) return projects
    const q = searchQuery.toLowerCase()
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.clientName?.toLowerCase().includes(q) ?? false)
    )
  }, [projects, searchQuery])

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <h1 className="text-h1 font-semibold">Projects</h1>
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:max-w-xs sm:flex-initial sm:flex-none">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden />
              <Input
                type="search"
                placeholder="Search projects, clients..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search projects"
              />
            </div>
            <CreateProjectCTA variant="dropdown" />
          </div>
        </div>

        <QuickFilters filters={filters} onFiltersChange={setFilters} />

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section aria-labelledby="projects-heading">
            <h2 id="projects-heading" className="sr-only">
              Project tiles
            </h2>
            <ProjectTilesList
              projects={filteredBySearch}
              isLoading={projectsLoading}
              className="min-w-0"
            />
          </section>
          <aside className="lg:max-w-[340px]">
            <ActivityFeed
              items={activityItems}
              isLoading={activityLoading}
            />
          </aside>
        </div>
      </div>
  )
}
