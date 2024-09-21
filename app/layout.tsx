import { Noto_Serif_JP } from 'next/font/google'
import '../styles/globals.css'

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSerifJP.className}>
      <body>
        <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
          <h1 className="text-4xl font-bold text-center">
            平泉 Wi-Fi スポットマップ
          </h1>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}