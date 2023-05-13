import './globals.css'
import { Inter } from 'next/font/google'
import { GlobalStateProvider } from './page'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Credential Corgi",
  description: "Created by the Corgi Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalStateProvider>
      {/* <html lang="en">
      <body className={inter.className}>{children}</body>
    </html> */}

      <html lang="en">
        <body className='bg-white'>{children}</body>
      </html>

      {/* <html lang="en" className='h-full bg-white'>
    <body className='h-full'>{children}</body>
    </html> */}
    </GlobalStateProvider>
  )
}
