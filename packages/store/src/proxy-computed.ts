import type { Snapshot } from './proxy'
import { proxy, snapshot } from './proxy'

export function proxyWithComputed<T extends object, U extends object>(
  initialObject: T,
  computedFns: {
    [K in keyof U]:
      | ((snap: Snapshot<T>) => U[K])
      | {
        get: (snap: Snapshot<T>) => U[K]
        set?: (state: T, newValue: U[K]) => void
      }
  },
) {
  const keys = Object.keys(computedFns) as (keyof U)[]
  keys.forEach((key) => {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error('object property already defined')
    }
  })

  const proxyObject = proxy(initialObject) as T & U

  keys.forEach((key) => {
    const computedFn = computedFns[key]
    const { get, set } = (typeof computedFn === 'function' ? { get: computedFn } : computedFn) as {
      get: (snap: Snapshot<T>) => U[typeof key]
      set?: (state: T, newValue: U[typeof key]) => void
    }
    const desc: PropertyDescriptor = {}
    desc.get = () => get(snapshot(proxyObject))
    if (set) {
      desc.set = newValue => set(proxyObject, newValue)
    }
    Object.defineProperty(proxyObject, key, desc)
  })

  return proxyObject
}
