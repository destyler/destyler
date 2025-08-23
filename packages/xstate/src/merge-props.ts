import { callAll, isString } from '@destyler/utils'

interface Props {
  [key: string]: any
}

function clsx(...args: (string | undefined)[]) {
  return args
    .map(str => str?.trim?.())
    .filter(Boolean)
    .join(' ')
}

const CSS_REGEX = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g

function serialize(style: string): Record<string, string> {
  const res: Record<string, string> = {}
  let match: RegExpExecArray | null
  while ((match = CSS_REGEX.exec(style))) {
    res[match[1]!] = match[2]!
  }
  return res
}

function css(a: Record<string, string> | string | undefined, b: Record<string, string> | string | undefined): Record<string, string> | string {
  if (isString(a)) {
    if (isString(b))
      return `${a};${b}`
    a = serialize(a)
  }
  else if (isString(b)) {
    b = serialize(b)
  }
  return Object.assign({}, a ?? {}, b ?? {})
}

type TupleTypes<T extends any[]> = T[number]

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export function mergeProps<T extends Props>(...args: T[]): UnionToIntersection<TupleTypes<T[]>> {
  const result: Props = {}

  for (const props of args) {
    for (const key in result) {
      if (key.startsWith('on') && typeof result[key] === 'function' && typeof props[key] === 'function') {
        result[key] = callAll(props[key], result[key])
        continue
      }

      if (key === 'className' || key === 'class') {
        result[key] = clsx(result[key], props[key])
        continue
      }

      if (key === 'style') {
        result[key] = css(result[key], props[key])
        continue
      }

      result[key] = props[key] !== undefined ? props[key] : result[key]
    }

    // Add props from b that are not in a
    for (const key in props) {
      if (result[key] === undefined) {
        result[key] = props[key]
      }
    }
  }

  return result as any
}
