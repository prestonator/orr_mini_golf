'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useIdleTimeout(timeoutMs: number = 30000, redirectPath: string = '/') {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        router.push(redirectPath)
      }, timeoutMs)
    }

    // Set initial timeout
    resetTimeout()

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout)
    })

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout)
      })
    }
  }, [router, timeoutMs, redirectPath])
}
