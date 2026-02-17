import { useQuery } from '@tanstack/react-query'
import type { ActivityItem } from '@/types'

export interface ActivityFeedItem extends ActivityItem {
  projectName?: string
  subtype?: 'comment' | 'approval' | 'upload'
}

const MOCK_ACTIVITY: ActivityFeedItem[] = [
  {
    id: 'a1',
    type: 'decision',
    subtype: 'approval',
    title: 'Fixture package approved',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    projectId: '1',
    projectName: 'Riverside Residence',
  },
  {
    id: 'a2',
    type: 'document',
    subtype: 'upload',
    title: 'Floor plan v3 uploaded',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    projectId: '2',
    projectName: 'Downtown Office Fit-out',
  },
  {
    id: 'a3',
    type: 'message',
    subtype: 'comment',
    title: 'New comment on Schematic Review',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    projectId: '1',
    projectName: 'Riverside Residence',
  },
  {
    id: 'a4',
    type: 'decision',
    subtype: 'approval',
    title: 'Client approved option B',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    projectId: '3',
    projectName: 'Warehouse Conversion',
  },
]

export function useActivityFeed() {
  return useQuery({
    queryKey: ['activity-feed'],
    queryFn: async (): Promise<ActivityFeedItem[]> => {
      await new Promise((r) => setTimeout(r, 200))
      return MOCK_ACTIVITY
    },
  })
}
