import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { PrefetchThrottle } from '../components/PrefetchThrottle'
import FeedbackButton from '../components/FeedbackButton'
import 'nextra-theme-docs/style.css'
import '../styles/mermaid-theme.css'

const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.638z"
      fill="currentColor"
    />
  </svg>
)

export const metadata = {
  title: {
    template: '%s – Yasha Learn Code',
  },
  description: 'Интерактивный курс по веб-разработке',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()

  const navbar = (
    <Navbar
      logo={<span style={{ fontWeight: 700 }}>Yasha Learn Code</span>}
      projectLink="https://github.com/yasha-ai/yasha-learn-code"
    >
      <a
        href="https://t.me/daonejuniorday"
        target="_blank"
        rel="noreferrer"
        style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
        title="Автор: @daonejuniorday"
      >
        <TelegramIcon />
        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }} className="hidden sm:inline">
          Léha
        </span>
      </a>
      <a
        href="https://t.me/yasha_ai_dev"
        target="_blank"
        rel="noreferrer"
        style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
        title="Бот: @yasha_ai_dev"
      >
        <TelegramIcon />
        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }} className="hidden sm:inline">
          Yasha
        </span>
      </a>
    </Navbar>
  )

  return (
    <html lang="ru" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <PrefetchThrottle />
        <Layout
          navbar={navbar}
          footer={<Footer>Создано с 💜 от Яши</Footer>}
          docsRepositoryBase="https://github.com/yasha-ai/yasha-learn-code/tree/main"
          pageMap={pageMap}
          darkMode
          nextThemes={{ defaultTheme: 'dark' }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
        <FeedbackButton />
      </body>
    </html>
  )
}
