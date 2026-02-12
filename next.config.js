const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

module.exports = withNextra({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Оптимизация для Docker
  eslint: {
    // Внимание: Это отключает проверку линтером во время продакшн-сборки
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Внимание: Это отключает проверку типов во время продакшн-сборки
    ignoreBuildErrors: true,
  },
})