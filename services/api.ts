import axios from 'axios'

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000'

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
})

export const REVALIDATE = 15

// Server-side fetch with ISR. Use in Server Components for primary data.
export async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const url = `${BACKEND_URL}/api${path}`
    const res = await fetch(url, {
      ...init,
      next: { revalidate: REVALIDATE, ...(init as any).next },
    })
    if (!res.ok) {
      console.error(`serverFetch ${url} -> ${res.status}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error('serverFetch error:', err)
    return null
  }
}
