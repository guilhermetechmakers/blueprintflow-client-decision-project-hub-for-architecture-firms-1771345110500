import { api } from '@/lib/api'
import type { Notification, NotificationPreferences } from '@/types'

export const notificationsApi = {
  list: async (params?: { unreadOnly?: boolean; limit?: number }): Promise<Notification[]> => {
    const qs = new URLSearchParams()
    if (params?.unreadOnly) qs.set('unread_only', 'true')
    if (params?.limit) qs.set('limit', String(params.limit))
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return api.get<Notification[]>(`/notifications${suffix}`)
  },

  markRead: async (id: string): Promise<void> => {
    return api.patch(`/notifications/${id}`, { read: true })
  },

  markAllRead: async (): Promise<void> => {
    return api.post('/notifications/mark-all-read', {})
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    return api.get<NotificationPreferences>('/notifications/preferences')
  },

  updatePreferences: async (prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    return api.put<NotificationPreferences>('/notifications/preferences', prefs)
  },
}
