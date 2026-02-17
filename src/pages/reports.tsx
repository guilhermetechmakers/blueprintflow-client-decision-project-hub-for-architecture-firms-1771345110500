import { useParams } from 'react-router-dom'
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/use-projects'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MOCK_DATA = [
  { name: 'Jan', decisions: 4, approved: 3 },
  { name: 'Feb', decisions: 6, approved: 5 },
  { name: 'Mar', decisions: 5, approved: 4 },
]

export function Reports() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h1">Reports & analytics</h1>
        <Button variant="secondary">
          <Download className="size-4" />
          Export
        </Button>
      </div>

      <p className="text-body text-muted-foreground">
        Pre-built reports and KPIs for {project?.name ?? 'this project'}.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Pending approvals
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">2</p>
            <p className="text-small text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3" />
              vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Decisions this month
            </CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">5</p>
            <p className="text-small text-muted-foreground">3 approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Overdue tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-small text-muted-foreground">On track</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-small" />
                <YAxis className="text-small" />
                <Tooltip />
                <Bar dataKey="decisions" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="rgb(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
