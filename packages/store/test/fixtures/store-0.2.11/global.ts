function glob(): any {
  if (typeof globalThis !== 'undefined')
    return globalThis
  if (typeof globalThis !== 'undefined')
    return globalThis
  if (typeof window !== 'undefined')
    return window
}

export function globalRef<T>(key: string, value: () => T): T {
  const g = glob()
  if (!g)
    return value()
  g[key] ||= value()
  return g[key]
}

export const refSet = globalRef('__destyler__refSet', () => new WeakSet())
