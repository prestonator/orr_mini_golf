'use client'

import { useIdleTimeout } from '@/hooks/useIdleTimeout'

export function IdleTimer({ timeoutMs = 60000, redirectPath = '/' }: { timeoutMs?: number, redirectPath?: string }) {
  useIdleTimeout(timeoutMs, redirectPath)
  return null
}
