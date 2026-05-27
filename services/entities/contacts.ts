import { serverFetch } from '../serverFetch'
import type { ContactsPublic, FooterColumn } from '../types'

export function fetchContacts() {
  return serverFetch<ContactsPublic>('/contacts')
}

export function fetchFooter() {
  return serverFetch<FooterColumn[]>('/footer')
}
