import { serverFetch } from '../api'
import type { HomeContent } from '../types'

export function fetchHomeContent() {
  return serverFetch<HomeContent>('/home-content')
}
