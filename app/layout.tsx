import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['300','400','500','600','700','800'] });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500'], style: ['normal','italic'] });

export const metadata: Metadata = {
  title: 'Personagram – Create Digital Personas and AI Agents',
  description: 'The marketplace and community for powerful AI prompts, personas, and agent workflows.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmSans.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
