type AnyFunction = (...args: any[]) => any
const isFunction = (value: any): value is AnyFunction => typeof value === 'function'

export function reflect<T extends Record<string, any>>(obj: () => T): T {
  return new Proxy(obj() as T, {
    get(_, prop) {
      const target = obj()
      const value = Reflect.get(target, prop)
      // @ts-expect-error - This is a hack to bind methods to the target object.
      return isFunction(value) ? value.bind(target) : value
    },
  })
}
