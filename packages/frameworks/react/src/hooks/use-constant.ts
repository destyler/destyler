import { useRef } from 'react'

export function useConstant<T>(fn: () => T): T {
  const ref = useRef<{ v: T }>(undefined)
  if (!ref.current)
    ref.current = { v: fn() }
  return ref.current.v
}
