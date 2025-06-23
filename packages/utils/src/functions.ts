export type MaybeFunction<T> = T | (() => T)

export type Nullable<T> = T | null | undefined

export function runIfFn<T>(v: T | undefined,  ...a: T extends (...a: any[]) => void ? Parameters<T> : never): T extends (...a: any[]) => void ? NonNullable<ReturnType<T>> : NonNullable<T> {
  const res = typeof v === 'function' ? v(...a) : v
  return res ?? undefined
}

export const cast = <T>(v: unknown): T => v as T

export function noop() {}

export function callAll<T extends (...a: any[]) => void>(...fns: (T | undefined)[]) {
  return (...a: Parameters<T>) => {
    fns.forEach((fn) => {
      fn?.(...a)
    })
  }
}

export const uuid = /* #__PURE__ */ (() => {
  let id = 0
  return () => {
    id++
    return id.toString(36)
  }
})()

export function match<V extends string | number = string, R = unknown>(
  key: V,
  record: Record<V, R | ((...args: any[]) => R)>,
  ...args: any[]
): R {
  if (key in record) {
    const fn = record[key]
    return typeof fn === 'function' ? (fn as (...args: any[]) => R)(...args) : fn as R
  }

  const error = new Error(`No matching key: ${JSON.stringify(key)} in ${JSON.stringify(Object.keys(record))}`)
  Error.captureStackTrace?.(error, match)

  throw error
}

export function tryCatch<R>(fn: () => R, fallback: () => R) {
  try {
    return fn()
  }
 catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace?.(error, tryCatch)
    }
    return fallback?.()
  }
}
