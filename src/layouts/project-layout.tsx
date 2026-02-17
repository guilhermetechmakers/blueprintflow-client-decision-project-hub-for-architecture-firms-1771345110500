import { Outlet } from 'react-router-dom'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardTopbar } from '@/components/dashboard-topbar'
import { ProjectSidebar } from '@/components/project-sidebar'

function ProjectLayoutInner() {
  const { width } = useSidebar()
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <DashboardTopbar />
      <div className="flex" style={{ marginLeft: width }}>
        <ProjectSidebar />
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function ProjectLayout() {
  return (
    <SidebarProvider>
      <ProjectLayoutInner />
    </SidebarProvider>
  )
}
