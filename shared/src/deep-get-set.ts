export function deepSet<T extends Record<string, any>>(obj: T, path: string, value: any) {
  const parts = path.split('.')

  const last = parts.pop()
  if (!last)
    return

  const parent = parts.reduce<any>((acc, key) => {
    if (!acc[key])
      acc[key] = {}
    return acc[key]
  }, obj)

  parent[last] = value
}

export function deepGet<T extends Record<string, any>>(obj: T, path: string) {
  const parts = path.split('.')

  return parts.reduce<any>((obj, key) => {
    if (!obj)
      return undefined
    return obj[key]
  }, obj)
}

export function deepExpand<T extends Record<string, any>>(obj: T) {
  const result: T = {} as any

  for (const key in obj) {
    const value = obj[key]
    if (value == null)
      continue
    deepSet(result, key, obj[key])
  }

  return result
}
