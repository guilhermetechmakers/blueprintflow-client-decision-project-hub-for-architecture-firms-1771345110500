import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function Settings() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-h1">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Firm branding</CardTitle>
          <CardDescription>Logo and colors for the client portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Upload logo</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Default notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email digests</Label>
            <Button variant="secondary" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <Label>Weekly summary</Label>
            <Button variant="secondary" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Storage and SSO.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary">Connect Google Drive</Button>
          <Button variant="secondary" className="ml-2">Configure SSO</Button>
        </CardContent>
      </Card>
    </div>
  )
}
