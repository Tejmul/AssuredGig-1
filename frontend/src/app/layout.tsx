import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Navigation } from '@/components/Navigation'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/AuthProvider'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AssuredGig - The Future of Freelancing',
  description: 'Connect with top freelancers and clients worldwide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="top-center" />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 