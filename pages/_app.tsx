import Script from 'next/script'
import { MDXProvider } from '@mdx-js/react'
import { useEffect } from 'react'
import { Playground } from '../components/Playground'
import '../styles/mermaid-theme.css'

const components = {
  Playground,
}

export default function App({ Component, pageProps }) {
  // Client-side only: throttle prefetch to prevent 503 on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let prefetchQueue = []
    let processing = false
    const MAX_CONCURRENT = 3
    const DELAY = 300
    
    const originalFetch = window.fetch
    window.fetch = function(...args) {
      const url = args[0]
      // Only throttle Next.js chunk prefetch
      if (typeof url === 'string' && url.includes('/_next/static/chunks/pages/')) {
        return new Promise((resolve, reject) => {
          prefetchQueue.push(() => originalFetch(...args).then(resolve).catch(reject))
          processQueue()
        })
      }
      return originalFetch(...args)
    }
    
    function processQueue() {
      if (processing || prefetchQueue.length === 0) return
      processing = true
      
      const batch = prefetchQueue.splice(0, MAX_CONCURRENT)
      Promise.all(batch.map(fn => fn())).finally(() => {
        processing = false
        if (prefetchQueue.length > 0) {
          setTimeout(processQueue, DELAY)
        }
      })
    }
  }, [])
  
  return (
    <MDXProvider components={components}>
      <Script
        id="mermaid-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.mermaidConfig = {
              startOnLoad: true,
              theme: 'base',
              themeVariables: {
                primaryColor: '#1a1f1a',
                primaryTextColor: '#e0ffe0',
                primaryBorderColor: '#00ff41',
                lineColor: '#00cc33',
                secondaryColor: '#1a2a1a',
                tertiaryColor: '#0a0e0a',
                background: '#0a0e0a',
                mainBkg: '#1a1f1a',
                secondBkg: '#1a2a1a',
                textColor: '#e0ffe0',
                border1: '#00ff41',
                border2: '#00cc33',
                arrowheadColor: '#00cc33',
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                fontSize: '14px'
              }
            };
          `
        }}
      />
      <Component {...pageProps} />
    </MDXProvider>
  )
}
