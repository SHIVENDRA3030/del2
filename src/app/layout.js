import './globals.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export const metadata = {
  title: 'Delhivery Clone - Logisitics Platform',
  description: 'India\'s largest fully integrated logistics provider',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
