import { serverFetch } from '../api'
import type { Tag } from '../types'

export function fetchTags() {
  return serverFetch<Tag[]>('/tags')
}
