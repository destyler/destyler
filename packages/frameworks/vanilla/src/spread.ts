import { toStyleString } from './utils/style'

export interface Attrs {
  [key: string]: any
}

export function spread(attrs?: Attrs) {
  if (!attrs)
    return ''
  const parts: string[] = []
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null)
      continue
    if (typeof value === 'function')
      continue
    if (typeof value === 'boolean') {
      if (value)
        parts.push(key)
      continue
    }
    if (key === 'style' && typeof value === 'object') {
      const css = toStyleString(value)
      if (css)
        parts.push(`style="${css}"`)
      continue
    }
    const escaped = String(value).replace(/"/g, '&quot;')
    parts.push(`${key}="${escaped}` + `"`)
  }
  return parts.join(' ')
}
