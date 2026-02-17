import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 auth-panel-gradient">
        <div className="max-w-md text-white space-y-6 animate-fade-in-up">
          <h2 className="text-2xl font-semibold tracking-tight">
            Client Decision & Project Hub
          </h2>
          <p className="text-white/90 text-body leading-relaxed">
            Centralize timelines, decision logs, documents, and communication in one polished portal.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-small font-medium">
              Decisions
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-small font-medium">
              Approvals
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-small font-medium">
              Documents
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
