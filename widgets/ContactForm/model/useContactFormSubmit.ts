'use client'

import { useState } from 'react'
import { useCreateLead } from '@/services/entities/leads'
import type { IContactFormValues } from './contactFormSchema'

export type ContactFormSubmitState = 'idle' | 'success' | 'error'

const RESET_DELAY_MS = 5000

export function useContactFormSubmit(onSuccess?: () => void) {
  const createLead = useCreateLead()
  const [state, setState] = useState<ContactFormSubmitState>('idle')

  const submit = async (values: IContactFormValues) => {
    try {
      await createLead.mutateAsync({
        name: values.name,
        phone: values.phone,
        message:
          [values.objectType ? `Тип объекта: ${values.objectType}` : null, values.message]
            .filter(Boolean)
            .join('\n\n') || undefined,
        source: 'contacts_page',
      })
      setState('success')
      onSuccess?.()
      setTimeout(() => setState('idle'), RESET_DELAY_MS)
      return true
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), RESET_DELAY_MS)
      return false
    }
  }

  return { state, submit, isPending: createLead.isPending }
}
