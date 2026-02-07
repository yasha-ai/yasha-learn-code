import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Learn Code | Изучай программирование',
  description: 'Бесплатная платформа для изучения HTML, CSS, JavaScript, TypeScript, React и Git',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
