import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/main-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zetsu Dashboard - Monitoring System',
  description: 'Real-time monitoring dashboard for Zetsu scraping system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 shadow-sm">
            <div className="container flex h-16 items-center">
              <MainNav />
            </div>
          </header>
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>
      </body>
    </html>
  )
}
