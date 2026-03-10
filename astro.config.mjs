import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import sidebar from './scripts/sidebar-generated.json' with { type: 'json' }

export default defineConfig({
  site: 'https://learn.yasha.dev',
  server: { port: 4010 },

  integrations: [
    react(),
    starlight({
      title: 'Яша.dev — Учим код',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Русский', lang: 'ru' },
      },
      logo: { src: './public/favicon.svg' },
      social: [
        { icon: 'telegram', label: 'Léha', href: 'https://t.me/daonejuniorday' },
        { icon: 'telegram', label: 'Yasha', href: 'https://t.me/yasha_ai_dev' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/yasha-ai/yasha-learn-code' },
      ],
      sidebar,
      editLink: { baseUrl: 'https://github.com/yasha-ai/yasha-learn-code/edit/main/' },
      customCss: ['./src/styles/custom.css'],
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
      },
    }),
  ],
})
