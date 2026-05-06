import type { Activity } from '@/services/types'

export interface HeaderLink {
  label: string
  href: string
  nestedLinks?: { label: string; href: string }[]
}

const STATIC_LINKS: HeaderLink[] = [
  { label: 'О компании', href: '/' },
  { label: 'Услуги', href: '/services' },
  { label: 'Проекты', href: '/projects' },
  { label: 'Новости', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
]

export function buildLinks(activities: Activity[] = []): HeaderLink[] {
  return STATIC_LINKS.map((link) => {
    if (link.href !== '/services') return link
    if (!activities.length) return link
    return {
      ...link,
      nestedLinks: activities.map((a) => ({
        label: a.title,
        href: `/services/${a.slug}`,
      })),
    }
  })
}

export const links = STATIC_LINKS
