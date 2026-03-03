'use client'
import { useEffect } from 'react'

export function PrefetchThrottle() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let prefetchQueue: Array<() => void> = []
    let processing = false
    const MAX_CONCURRENT = 3
    const DELAY = 300

    const originalFetch = window.fetch
    window.fetch = function (...args) {
      const url = args[0]
      if (typeof url === 'string' && url.includes('/_next/static/chunks/')) {
        return new Promise<Response>((resolve, reject) => {
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
      Promise.all(batch.map((fn) => fn())).finally(() => {
        processing = false
        if (prefetchQueue.length > 0) setTimeout(processQueue, DELAY)
      })
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return null
}
