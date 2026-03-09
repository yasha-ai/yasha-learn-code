import nextra from 'nextra'
import rehypeTransliterateSlugs from './plugins/rehype-transliterate-slugs.mjs'
import { remarkMermaidTextFix } from './plugins/remark-mermaid-text-fix.mjs'

const withNextra = nextra({
  contentDirBasePath: '/',
  staticImage: false,
  mdxOptions: {
    rehypePlugins: [rehypeTransliterateSlugs],
    remarkPlugins: [remarkMermaidTextFix],
  },
})

export default withNextra({
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // Build optimizations for large sites
  swcMinify: true,
  optimizeFonts: false,
  
  experimental: {
    // Speed up builds with package import optimization
    optimizePackageImports: ['@codesandbox/sandpack-react'],
  },

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
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
})
