import { Outlet } from 'react-router-dom'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardTopbar } from '@/components/dashboard-topbar'

function DashboardLayoutInner() {
  const { width } = useSidebar()
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <DashboardTopbar />
      <main
        className="min-h-[calc(100vh-3.5rem)] p-6 animate-fade-in"
        style={{ marginLeft: width }}
      >
        <Outlet />
      </main>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardLayoutInner />
    </SidebarProvider>
  )
}
