import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { ProjectLayout } from '@/layouts/project-layout'
import { Landing } from '@/pages/landing'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import { Dashboard } from '@/pages/dashboard'
import { DashboardProjects } from '@/pages/dashboard-projects'
import { ProjectNew } from '@/pages/project-new'
import { ProjectOverview } from '@/pages/project-overview'
import { ProjectTimeline } from '@/pages/project-timeline'
import { DecisionLog } from '@/pages/decision-log'
import { Documents } from '@/pages/documents'
import { Messages } from '@/pages/messages'
import { Meetings } from '@/pages/meetings'
import { Tasks } from '@/pages/tasks'
import { Reports } from '@/pages/reports'
import { ProjectSettings } from '@/pages/project-settings'
import { Profile } from '@/pages/profile'
import { Settings } from '@/pages/settings'
import { AdminDashboard } from '@/pages/admin-dashboard'
import { Help } from '@/pages/help'
import { PasswordReset } from '@/pages/password-reset'
import { EmailVerification } from '@/pages/email-verification'
import { Pricing } from '@/pages/pricing'
import { Privacy } from '@/pages/privacy'
import { Terms } from '@/pages/terms'
import { NotFound } from '@/pages/not-found'
import { ErrorPage } from '@/pages/error-page'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'password-reset', element: <PasswordReset /> },
      { path: 'email-verification', element: <EmailVerification /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <DashboardProjects /> },
      { path: 'projects/new', element: <ProjectNew /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'admin', element: <AdminDashboard /> },
      {
        path: 'projects/:projectId',
        element: <ProjectLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: 'overview', element: <ProjectOverview /> },
          { path: 'timeline', element: <ProjectTimeline /> },
          { path: 'decisions', element: <DecisionLog /> },
          { path: 'documents', element: <Documents /> },
          { path: 'messages', element: <Messages /> },
          { path: 'meetings', element: <Meetings /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'reports', element: <Reports /> },
          { path: 'settings', element: <ProjectSettings /> },
        ],
      },
    ],
  },
  { path: '/help', element: <DashboardLayout />, children: [{ index: true, element: <Help /> }] },
  { path: '/404', element: <NotFound /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '*', element: <NotFound /> },
])
