import { FooterClient } from './FooterClient'
import { fetchContacts, fetchFooter } from '@/services/entities/contacts'

const Footer = async () => {
  const [columns, contacts] = await Promise.all([fetchFooter(), fetchContacts()])
  return <FooterClient columns={columns ?? []} contacts={contacts} />
}

export { Footer }
