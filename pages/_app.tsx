import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Sidebar from '../components/sidebar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-5">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
