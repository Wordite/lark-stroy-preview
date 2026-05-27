export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://lark-stroy.ru'
  return raw.replace(/\/$/, '')
}

interface SeoMetaInput {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  siteName?: string
}

export function buildMeta({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  siteName = 'Ларк Строй',
}: SeoMetaInput) {
  const url = `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const ogImages = image ? [{ url: image }] : undefined
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      locale: 'ru_RU',
      images: ogImages,
      ...(publishedTime && type === 'article' ? { publishedTime } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
