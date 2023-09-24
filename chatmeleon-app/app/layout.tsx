import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Chatmeleon',
  description: 'hehe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <ThemeProvider>
          <AuthContext>
            <ToasterContext />
            {children}
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  )
}
