import Script from 'next/script'
import '../styles/mermaid-theme.css'

export default function App({ Component, pageProps }) {
  return (
    <>
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
    </>
  )
}
