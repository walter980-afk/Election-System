import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lubiri SS E-Voting Platform',
  description: 'Created by Sseruwagi Sinclaire Sebastian',
  generator: 'Sseruwagi Sinclaire Sebatian',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
