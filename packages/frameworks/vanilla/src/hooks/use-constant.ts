const constantsMap = new WeakMap<object, any>()

export function useConstant<T>(target: object, key: string, fn: () => T): T {
  if (!constantsMap.has(target)) {
    constantsMap.set(target, new Map())
  }

  const targetConstants = constantsMap.get(target)

  if (!targetConstants.has(key)) {
    targetConstants.set(key, fn())
  }

  return targetConstants.get(key)
}
