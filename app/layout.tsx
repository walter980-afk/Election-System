import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lubiri SS E-Voting Platform',
  description: 'Created by Sseruwagi Sinclaire Sebastian',
  icon: 'components/favicon.ico', // Path to your icon file in the public directory
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
