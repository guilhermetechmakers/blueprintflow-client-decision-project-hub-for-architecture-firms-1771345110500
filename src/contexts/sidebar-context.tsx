import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggle: () => void
  width: number
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

const SIDEBAR_WIDTH = 240
const SIDEBAR_WIDTH_COLLAPSED = 72

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = useCallback(() => setCollapsed((c) => !c), [])
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, width }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  return ctx ?? { collapsed: false, setCollapsed: () => {}, toggle: () => {}, width: SIDEBAR_WIDTH }
}
