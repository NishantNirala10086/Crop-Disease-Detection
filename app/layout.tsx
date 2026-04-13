import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Chatbot } from '@/components/chatbot'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Crop Dr - AI Crop Disease Detection',
  description: 'AI-powered crop disease detection and treatment recommendations for farmers',
}

export const viewport: Viewport = {
  themeColor: '#1B5E20',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Chatbot />
        <Analytics />
      </body>
    </html>
  )
}
