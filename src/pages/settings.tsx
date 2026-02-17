import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/hooks/use-notifications'
import { Bell, Mail, Smartphone, CalendarClock } from 'lucide-react'

export function Settings() {
  const { hash } = useLocation()
  const { data: prefs, isLoading: prefsLoading } = useNotificationPreferences()
  const updatePrefs = useUpdateNotificationPreferences()
  const [local, setLocal] = useState(prefs)

  useEffect(() => {
    if (prefs) setLocal(prefs)
  }, [prefs])

  useEffect(() => {
    if (hash === '#notifications') {
      document.getElementById('notifications')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  const handleToggle = (key: keyof NonNullable<typeof prefs>, value: boolean) => {
    if (!local) return
    const next = { ...local, [key]: value }
    setLocal(next)
    updatePrefs.mutate(next)
  }

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

      <Card id="notifications">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure in-app, email, and push notifications. Enable the weekly summary to receive
            &quot;what changed, what&apos;s next, what we need from you&quot; by email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {prefsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 p-2">
                      <Bell className="size-4 text-primary" aria-hidden />
                    </span>
                    <div>
                      <Label htmlFor="pref-inapp" className="text-body font-medium cursor-pointer">
                        In-app notifications
                      </Label>
                      <p className="text-small text-muted-foreground">
                        Show notifications in the dashboard top bar
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    id="pref-inapp"
                    checked={local?.inApp ?? true}
                    onChange={(e) => handleToggle('inApp', e.target.checked)}
                    disabled={updatePrefs.isPending}
                    aria-label="Toggle in-app notifications"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 p-2">
                      <Mail className="size-4 text-primary" aria-hidden />
                    </span>
                    <div>
                      <Label htmlFor="pref-email" className="text-body font-medium cursor-pointer">
                        Email notifications
                      </Label>
                      <p className="text-small text-muted-foreground">
                        Receive email for comments, approvals, and mentions
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    id="pref-email"
                    checked={local?.email ?? true}
                    onChange={(e) => handleToggle('email', e.target.checked)}
                    disabled={updatePrefs.isPending}
                    aria-label="Toggle email notifications"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 p-2">
                      <Smartphone className="size-4 text-primary" aria-hidden />
                    </span>
                    <div>
                      <Label htmlFor="pref-push" className="text-body font-medium cursor-pointer">
                        Push notifications
                      </Label>
                      <p className="text-small text-muted-foreground">
                        Browser or device push when you&apos;re not in the app
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    id="pref-push"
                    checked={local?.push ?? false}
                    onChange={(e) => handleToggle('push', e.target.checked)}
                    disabled={updatePrefs.isPending}
                    aria-label="Toggle push notifications"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-lg bg-accent/10 p-2">
                    <CalendarClock className="size-4 text-accent" aria-hidden />
                  </span>
                  <div>
                    <Label htmlFor="pref-weekly" className="text-body font-medium cursor-pointer">
                      Weekly summary email
                    </Label>
                    <p className="text-small text-muted-foreground">
                      Automated weekly digest: what changed, what&apos;s next, what we need from you
                    </p>
                  </div>
                  <Checkbox
                    id="pref-weekly"
                    checked={local?.weeklySummary ?? true}
                    onChange={(e) => handleToggle('weeklySummary', e.target.checked)}
                    disabled={updatePrefs.isPending}
                    aria-label="Toggle weekly summary email"
                  />
                </div>
                {local?.weeklySummary && (
                  <div className="ml-11 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-small font-medium text-foreground">Include in weekly summary</p>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={local.weeklySummaryWhatChanged}
                          onChange={(e) =>
                            handleToggle('weeklySummaryWhatChanged', e.target.checked)
                          }
                          disabled={updatePrefs.isPending}
                        />
                        <span className="text-small">What changed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={local.weeklySummaryWhatsNext}
                          onChange={(e) =>
                            handleToggle('weeklySummaryWhatsNext', e.target.checked)
                          }
                          disabled={updatePrefs.isPending}
                        />
                        <span className="text-small">What&apos;s next</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={local.weeklySummaryWhatWeNeed}
                          onChange={(e) =>
                            handleToggle('weeklySummaryWhatWeNeed', e.target.checked)
                          }
                          disabled={updatePrefs.isPending}
                        />
                        <span className="text-small">What we need from you</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
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
