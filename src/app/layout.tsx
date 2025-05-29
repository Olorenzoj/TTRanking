import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/Header'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gestión Torneos Tenis de Mesa',
  description: 'Sistema para administrar torneos de tenis de mesa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <main className="container mx-auto p-4">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}