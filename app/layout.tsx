import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lubiri SS E-Voting Platform',
  description: 'Created by Sseruwagi Sinclaire Sebastian',
  generator: 'Sseruwagi Sinclaire Sebatian',
}

     icons: {
        icon: 'components/favicon.ico', // Path to your icon file in the public directory
        shortcut: 'components/favicon.ico',
        apple: 'components/favicon.ico',
        other: {
          rel: 'components/favicon.ico',
          url: 'components/favicon.ico',


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
