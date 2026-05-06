import { serverFetch } from '../api'
import type { Activity, Service } from '../types'

export function fetchActivities() {
  return serverFetch<Activity[]>('/activities')
}

export function fetchActivityBySlug(slug: string) {
  return serverFetch<Activity>(`/activities/slug/${slug}`)
}

export function fetchServiceBySlugs(activitySlug: string, slug: string) {
  return serverFetch<Service & { activity: Activity }>(`/services/${activitySlug}/${slug}`)
}
