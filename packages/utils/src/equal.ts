const isArrayLike = (value: any) => value?.constructor.name === 'Array'

function isArrayEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length)
    return false
  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i]))
      return false
  }
  return true
}

export function isEqual(a: any, b: any, visited = new WeakMap()): boolean {
  if (Object.is(a, b))
    return true

  if ((a == null && b != null) || (a != null && b == null))
    return false

  // 处理循环引用
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    if (visited.has(a)) {
      return visited.get(a) === b
    }
    visited.set(a, b)
  }

  if (typeof a?.isEqual === 'function' && typeof b?.isEqual === 'function') {
    return a.isEqual(b) && b.isEqual(a)
  }

  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString()
  }

  // 处理 Date 对象
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // 处理数组和类数组对象
  if (isArrayLike(a) && isArrayLike(b)) {
    return isArrayEqual(Array.from(a), Array.from(b))
  }

  // 确保都是对象类型，且排除数组和 Date
  if (!(typeof a === 'object') || !(typeof b === 'object')
    || a === null || b === null
    || isArrayLike(a) || isArrayLike(b)
      || a instanceof Date || b instanceof Date) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  // 检查键的数量是否相等
  if (keysA.length !== keysB.length)
    return false

  // 检查所有键是否存在且值相等
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (!Reflect.has(b, key))
      return false
    if (!isEqual(a[key], b[key], visited))
      return false
  }

  return true
}
