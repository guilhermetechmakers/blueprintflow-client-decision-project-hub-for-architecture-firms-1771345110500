import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, CreditCard, FileText, Shield } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-h1">Admin dashboard</h1>
      <p className="text-body text-muted-foreground">
        Firm-level users, billing, templates, and audit logs.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Users
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="tertiary" className="p-0 h-auto font-semibold" asChild>
              <Link to="/dashboard/admin">Manage users</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Billing
            </CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="tertiary" className="p-0 h-auto font-semibold" asChild>
              <Link to="/dashboard/admin">Subscription</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Templates
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="tertiary" className="p-0 h-auto font-semibold" asChild>
              <Link to="/dashboard/admin">Templates library</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-small font-medium text-muted-foreground">
              Audit logs
            </CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="tertiary" className="p-0 h-auto font-semibold" asChild>
              <Link to="/dashboard/admin">View logs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
