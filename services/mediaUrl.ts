const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

/**
 * Prefix relative /uploads/... paths with the backend origin.
 * Absolute URLs (http/https) are returned as-is.
 */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BACKEND}${url}`
}
