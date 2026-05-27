import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { QueryProvider } from '@/services/QueryProvider'
import { fetchContacts } from '@/services/entities/contacts'
import { mediaUrl } from '@/services/mediaUrl'
import { getSiteUrl } from '@/services/seo'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
})

export async function generateMetadata(): Promise<Metadata> {
  const contacts = await fetchContacts()
  const settings = contacts?.settings ?? {}
  const faviconUrl = mediaUrl(settings.site_favicon_url)
  const ogImageUrl = mediaUrl(settings.site_og_image_url)
  const title = settings.site_title || 'Ларк Строй'
  const description = settings.site_tagline || 'Строительная компания Ларк Строй'
  const siteUrl = getSiteUrl()

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${title}` },
    description,
    applicationName: title,
    icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: siteUrl,
      siteName: title,
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const contacts = await fetchContacts()
  const settings = contacts?.settings ?? {}
  const socials = contacts?.socials ?? []
  const siteUrl = getSiteUrl()
  const orgName = settings.site_title || 'Ларк Строй'
  const orgDescription = settings.site_tagline || 'Строительная компания Ларк Строй'
  const logo = mediaUrl(settings.site_favicon_url) || mediaUrl(settings.site_og_image_url)
  const phone = settings.contact_phone
  const email = settings.contact_email
  const address = settings.contact_address

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: orgName,
    description: orgDescription,
    url: siteUrl,
    ...(logo ? { logo } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: address,
            addressCountry: 'RU',
            addressRegion: 'Республика Крым',
          },
        }
      : {}),
    areaServed: 'RU',
    sameAs: socials.map((s) => s.href).filter(Boolean),
  }

  return (
    <html
      lang='ru'
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`,
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
