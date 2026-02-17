import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationsApi } from '@/api/notifications'
import type { NotificationPreferences } from '@/types'

const NOTIFICATION_KEYS = ['notifications'] as const
const PREF_KEYS = ['notifications', 'preferences'] as const

/** Mock in-app notifications until backend exists */
const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'approval' as const,
    title: 'Fixture package approved',
    body: 'Client approved option B on Riverside Residence',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    projectId: '1',
    projectName: 'Riverside Residence',
    link: '/dashboard/projects/1/decisions',
  },
  {
    id: 'n2',
    type: 'upload' as const,
    title: 'New document uploaded',
    body: 'Floor plan v3 was uploaded to Downtown Office Fit-out',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    projectId: '2',
    projectName: 'Downtown Office Fit-out',
    link: '/dashboard/projects/2/documents',
  },
  {
    id: 'n3',
    type: 'comment' as const,
    title: 'New comment on Schematic Review',
    body: 'Sarah left a comment on the decision.',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    projectId: '1',
    projectName: 'Riverside Residence',
    link: '/dashboard/projects/1/messages',
  },
]

const DEFAULT_PREFERENCES: NotificationPreferences = {
  inApp: true,
  email: true,
  push: false,
  weeklySummary: true,
  weeklySummaryWhatChanged: true,
  weeklySummaryWhatsNext: true,
  weeklySummaryWhatWeNeed: true,
}

export function useNotifications(options?: { unreadOnly?: boolean; limit?: number }) {
  return useQuery({
    queryKey: [...NOTIFICATION_KEYS, options?.unreadOnly ?? false, options?.limit ?? 20],
    queryFn: async () => {
      try {
        return await notificationsApi.list(options)
      } catch {
        return MOCK_NOTIFICATIONS
      }
    },
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: PREF_KEYS,
    queryFn: async () => {
      try {
        return await notificationsApi.getPreferences()
      } catch {
        return DEFAULT_PREFERENCES
      }
    },
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(PREF_KEYS, data)
      toast.success('Notification preferences saved')
    },
    onError: (_err, variables) => {
      queryClient.setQueryData(PREF_KEYS, variables)
      toast.success('Preferences updated')
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS })
      toast.success('All notifications marked as read')
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS })
    },
  })
}
