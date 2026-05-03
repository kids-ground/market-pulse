import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

const notoKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: 'Market Pulse',
  description: 'N년 전 $100을 투자했다면 지금은 얼마일까요?',
  openGraph: {
    title: 'Market Pulse',
    description: 'N년 전 $100을 투자했다면 지금은 얼마일까요?',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoKR.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), var(--font-noto), -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
