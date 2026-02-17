import { BookOpen, ListChecks, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Help() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-h1">Help & support</h1>
      <p className="text-body text-muted-foreground">
        Knowledge base, onboarding, and contact support.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <BookOpen className="size-8 text-primary mb-2" />
            <CardTitle>Knowledge base</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-small text-muted-foreground mb-4">
              Browse articles and guides.
            </p>
            <Button variant="secondary" size="sm">Browse</Button>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <ListChecks className="size-8 text-primary mb-2" />
            <CardTitle>Onboarding checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-small text-muted-foreground mb-4">
              Get started with BlueprintFlow.
            </p>
            <Button variant="secondary" size="sm">View checklist</Button>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <MessageCircle className="size-8 text-primary mb-2" />
            <CardTitle>Contact support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-small text-muted-foreground mb-4">
              We’re here to help.
            </p>
            <Button variant="secondary" size="sm">Contact</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
