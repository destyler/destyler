import { toStyleString } from './utils/style'

export interface Attrs {
  [key: string]: any
}

function escapeAttribute(value: unknown) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

const booleanishAttributes = new Set(['contenteditable', 'draggable', 'spellcheck'])

export function spread(attrs?: Attrs) {
  if (!attrs)
    return ''
  const parts: string[] = []
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null)
      continue
    if (typeof value === 'function')
      continue
    if (typeof value === 'boolean' && !key.startsWith('aria-') && !key.startsWith('data-') && !booleanishAttributes.has(key.toLowerCase())) {
      if (value)
        parts.push(key)
      continue
    }
    if (key === 'style' && typeof value === 'object') {
      const css = toStyleString(value)
      if (css)
        parts.push(`style="${escapeAttribute(css)}"`)
      continue
    }
    const escaped = escapeAttribute(value)
    parts.push(`${key}="${escaped}` + `"`)
  }
  return parts.join(' ')
}
