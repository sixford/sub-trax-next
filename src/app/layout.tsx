'use client'

import './globals.css'
// import Header from './components/Header'
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* <Header /> */}
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}

