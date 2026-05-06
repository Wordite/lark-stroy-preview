import { useMutation } from '@tanstack/react-query'
import { api } from '../api'

export interface CreateLeadInput {
  name: string
  phone: string
  email?: string
  message?: string
  source?: string
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async (body: CreateLeadInput) => {
      const res = await api.post<{ ok: boolean }>('/leads', body)
      return res.data
    },
  })
}
