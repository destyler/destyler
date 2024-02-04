const BUTTON_INPUT_TYPES = [
  'button',
  'color',
  'file',
  'image',
  'reset',
  'submit',
]

export function isButton(element: { tagName: string, type?: string }) {
  const tagName = element.tagName.toLowerCase()

  if (tagName === 'button')
    return true

  if (tagName === 'input' && element.type)
    return BUTTON_INPUT_TYPES.includes(element.type)

  return false
}
