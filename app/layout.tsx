import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { QueryProvider } from '@/services/QueryProvider'
import { fetchContacts } from '@/services/entities/contacts'
import { mediaUrl } from '@/services/mediaUrl'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
})

export async function generateMetadata(): Promise<Metadata> {
  const contacts = await fetchContacts()
  const settings = contacts?.settings ?? {}
  const faviconUrl = mediaUrl(settings.site_favicon_url)
  const title = settings.site_title || 'Ларк Строй'
  const description = settings.site_tagline || 'Строительная компания Ларк Строй'
  return {
    title,
    description,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru' className={`${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}`,
          }}
        />
      </head>
      <body className='min-h-full flex flex-col'>
        <QueryProvider>
          <Header />
          <main className='px-(--container-offset)'>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
