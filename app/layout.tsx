import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
  title: 'Ларк Строй',
  description: 'Строительная компания Ларк Строй',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru' className={`${montserrat.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <Header />
        <main className='px-(--container-offset)'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
