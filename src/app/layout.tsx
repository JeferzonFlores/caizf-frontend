import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactNode, Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthProvider'
import { Toaster } from '@/components/ui/sonner'
import { LoadingProvider } from '@/contexts/LoadingProvider'
import DebugBanner from '@/components/EnvironmentIndicator'
import { Loader } from 'lucide-react'
import ReactQueryProvider from '@/contexts/ReactQueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Frontend base',
  description: 'Creado con NextJS (App Router) y Tailwind (Shadcn/ui)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              <DebugBanner />
              <AuthProvider>
                <Suspense
                  fallback={
                    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                      <div className="animate-fade-in">
                        <Loader className="h-10 w-10 animate-spin" />
                      </div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </AuthProvider>
            </LoadingProvider>
            <Toaster
              position={'top-center'}
              richColors
              closeButton
              toastOptions={{}}
            />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
