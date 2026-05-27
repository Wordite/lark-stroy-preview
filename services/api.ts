import axios from 'axios'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
})

export const REVALIDATE = 15
