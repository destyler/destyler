export function toStyleString(style: Record<string, any> | null | undefined) {
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
