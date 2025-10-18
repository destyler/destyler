export interface Attrs {
  [key: string]: any
}

function toStyleString(style: any) {
  if (!style)
    return ''
  let string = ''
  for (let key in style) {
    const value = style[key]
    if (value === null || value === undefined)
      continue
    if (!key.startsWith('--'))
      key = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
    string += `${key}:${value};`
  }
  return string
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
