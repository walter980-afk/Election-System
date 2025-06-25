import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-voting Lubiri SS',
  description: 'Created by Sseruwagi Sinclaire Sebastian',
  generator: 'Sseruwagi Sinclaire Sebastian',
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
