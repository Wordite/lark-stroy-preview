import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ContactForm } from '@/widgets/ContactForm'
import { buildMeta } from '@/services/seo'

export const metadata: Metadata = buildMeta({
  title: 'Контакты',
  description: 'Телефон, e-mail и адрес офиса. Оставьте заявку — мы свяжемся с вами.',
  path: '/contacts',
})

export default function ContactPage() {
  return (
    <div className='mt-[10.625rem]'>
      <h1 className='sr-only'>Контакты компании Ларк Строй</h1>
      <Suspense fallback={null}>
        <ContactForm />
      </Suspense>
    </div>
  )
}
