export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: 'admin' | 'pm' | 'member' | 'client'
}

export interface Project {
  id: string
  name: string
  status: 'active' | 'on_hold' | 'completed' | 'archived'
  clientName?: string
  updatedAt: string
  pendingApprovals?: number
  /** Phase name for timeline display (e.g. "Schematic Design") */
  phase?: string
  /** 0–100 */
  percentComplete?: number
  /** User's role on this project */
  role?: 'owner' | 'member' | 'client'
  dueDate?: string
}

/** Dashboard project list table record (dashboard_(project_list)) */
export interface DashboardProjectListRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** DB record for decision_log table */
export interface DecisionLogRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Decision {
  id: string
  projectId: string
  title: string
  description: string
  status: 'draft' | 'pending' | 'approved' | 'changes_requested'
  phase?: string
  assigneeId?: string
  assigneeName?: string
  options: DecisionOption[]
  recommendedOptionId?: string
  recommendationText?: string
  approvedOptionId?: string
  approvedAt?: string
  approvedBy?: string
  created_at?: string
  updated_at?: string
  comments?: DecisionComment[]
  versions?: DecisionVersion[]
}

export interface DecisionOption {
  id: string
  title: string
  description?: string
  costDelta?: number
  imageUrl?: string
  pdfUrl?: string
  specLink?: string
}

export interface DecisionComment {
  id: string
  decisionId: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

export interface DecisionVersion {
  id: string
  decisionId: string
  version: number
  title: string
  changedAt: string
  changedBy: string
  summary?: string
}

export interface TimelinePhase {
  id: string
  name: string
  startDate: string
  endDate: string
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'done'
}

export interface ActivityItem {
  id: string
  type: 'decision' | 'document' | 'message' | 'task'
  title: string
  timestamp: string
  projectId?: string
  projectName?: string
  subtype?: 'comment' | 'approval' | 'upload'
}

/** Auth/session record for login/signup (table: login_/_signup) */
export interface LoginSignup {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}
