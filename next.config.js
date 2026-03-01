const rehypeTransliterateSlugs = require('./plugins/rehype-transliterate-slugs')
const path = require('path')

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    // Транслитерация русских якорей заголовков в латиницу
    // Например: id="переменные" → id="peremennye"
    rehypePlugins: [rehypeTransliterateSlugs],
  },
})

module.exports = withNextra({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Оптимизация для Docker
  compress: true, // Enable gzip compression
  poweredByHeader: false,
  
  // Оптимизация билда
  experimental: {
    optimisticClientCache: false,
    // Распараллеливание билда (использовать все ядра)
    cpus: require('os').cpus().length,
  },
  
  // Ускорение production build
  productionBrowserSourceMaps: false, // Отключить source maps
  
  // Webpack оптимизации
  webpack: (config, { isServer }) => {
    // The remark-mermaid plugin injects absolute-path imports into MDX files.
    // Alias that absolute path to our custom component (forces black text on all nodes).
    const mermaidOriginalPath = require.resolve('@theguild/remark-mermaid/mermaid')
    config.resolve.alias[mermaidOriginalPath] = path.resolve(__dirname, 'components/CustomMermaid.tsx')

    if (!isServer) {
      // Уменьшить размер client bundle
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Разбиваем vendor библиотеки
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Общий код между страницами
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    }
    return config
  },
  
  // Заголовки для агрессивного кеширования статики
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  eslint: {
    // Внимание: Это отключает проверку линтером во время продакшн-сборки
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Внимание: Это отключает проверку типов во время продакшн-сборки
    ignoreBuildErrors: true,
  },
})
