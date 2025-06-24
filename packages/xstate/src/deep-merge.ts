import { compact, isPlainObject } from '@destyler/utils'

export function deepMerge<T extends Record<string, any>>(source: T, ...objects: (Partial<T> | undefined | null)[]): T
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>[]>(
  source: T,
  ...objects: (U[number] | undefined | null)[]
): T & UnionToIntersection<U[number]>
export function deepMerge<T extends Record<string, any>>(source: T, ...objects: any[]): any {
  if (!isPlainObject(source)) {
    throw new TypeError('Source argument must be a plain object')
  }

  // Use type assertion to allow mutation of generic type
  const result = source as Record<string, any>

  for (const obj of objects) {
    if (!isPlainObject(obj))
      continue

    const target = compact(obj)
    for (const key in target) {
      // Skip prototype chain properties
      if (!Object.prototype.hasOwnProperty.call(target, key))
        continue

      // Skip dangerous prototype pollution keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        continue

      const sourceVal = result[key]
      const targetVal = obj[key]

      if (isPlainObject(targetVal)) {
        result[key] = isPlainObject(sourceVal) ? deepMerge(sourceVal, targetVal) : { ...targetVal }
      }
      else {
        result[key] = targetVal
      }
    }
  }
  return result as T
}

// Helper type to convert union to intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
