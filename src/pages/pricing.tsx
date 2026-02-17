import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PLANS = [
  {
    name: 'Starter',
    price: 29,
    description: 'For small teams',
    features: ['5 projects', 'Decision log', 'Document storage', 'Email support'],
  },
  {
    name: 'Professional',
    price: 79,
    description: 'For growing firms',
    features: ['Unlimited projects', 'Templates', 'Reports & export', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'SSO & compliance',
    features: ['SSO/SAML', 'Audit logs', 'Dedicated success', 'Custom contracts'],
  },
]

export function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <Link to="/" className="font-semibold text-h2 text-primary">
            BlueprintFlow
          </Link>
          <Link to="/login">
            <Button variant="tertiary">Log in</Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-2">Pricing</h1>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Choose a plan. Scale as you grow. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? 'ring-2 ring-primary shadow-card-hover' : ''}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-body text-muted-foreground">{plan.description}</p>
                <p className="text-2xl font-semibold">
                  ${plan.price}
                  <span className="text-body font-normal text-muted-foreground">/mo</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-body">
                      <Check className="size-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  asChild
                >
                  <Link to="/signup">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
