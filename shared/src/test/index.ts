export * from './class'

const esc = (str: string) => str.replace(/[-[\]{}()*+?:.,\\^$|#\s]/g, '\\$&')

export const testid = (part: string) => `[data-testid=${esc(part)}]`

export const part = (part: string) => `[data-part=${esc(part)}]`

export function paste(node: HTMLElement, value: string) {
  const clipboardData = new DataTransfer()
  clipboardData.setData('text/plain', value)
  const event = new ClipboardEvent('paste', {
    clipboardData,
    bubbles: true,
    cancelable: true,
  })
  node.dispatchEvent(event)
}

export function nativeInput(node: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const event = new InputEvent('input', {
    bubbles: true,
    inputType: 'insertFromPaste',
  })

  const __input__setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  const __textarea__setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set

  const textValue = `${node.value}${value}`

  const set = node.localName === 'input' ? __input__setter : __textarea__setter
  set?.call(node, textValue)

  node.dispatchEvent(event)
}

export async function repeat(count: number, fn: () => unknown) {
  await Array.from({ length: count }).reduce((p: any) => p.then(fn), Promise.resolve())
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'



export * from './hooks'
