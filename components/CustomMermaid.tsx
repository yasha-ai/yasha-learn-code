'use client'

import { jsx } from 'react/jsx-runtime'
import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'

function Mermaid({ chart }: { chart: string }) {
  const id = useId()
  const [svg, setSvg] = useState('')

  useEffect(() => {
    const htmlElement = document.documentElement
    const mutationObserver = new MutationObserver(renderChart)
    mutationObserver.observe(htmlElement, { attributes: true })
    renderChart()
    return () => {
      mutationObserver.disconnect()
    }

    async function renderChart() {
      const isDarkTheme =
        htmlElement.classList.contains('dark') ||
        htmlElement.attributes.getNamedItem('data-theme')?.value === 'dark'

      const mermaidConfig = {
        startOnLoad: false,
        securityLevel: 'loose' as const,
        fontFamily: 'inherit',
        themeCSS: 'margin: 1.5rem auto 0;',
        // Keep original dark/default themes for correct sizing; only override text color
        theme: (isDarkTheme ? 'dark' : 'default') as 'dark' | 'default',
        themeVariables: {
          primaryTextColor: '#1a1a1a',
        },
      }

      try {
        mermaid.initialize(mermaidConfig)
        const { svg: renderedSvg } = await mermaid.render(
          id.replaceAll(':', ''),
          chart,
        )
        setSvg(renderedSvg)
      } catch (error) {
        console.error('Error while rendering mermaid', error)
      }
    }
  }, [chart])

  return jsx('div', { dangerouslySetInnerHTML: { __html: svg } })
}

export { Mermaid }
