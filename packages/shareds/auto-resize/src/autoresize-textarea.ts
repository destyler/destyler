import { getComputedStyle, getDocument, getWindow } from '@destyler/dom'

export function autoresizeTextarea(el: HTMLTextAreaElement | null) {
  if (!el)
    return

  const style = getComputedStyle(el)

  const win = getWindow(el)
  const doc = getDocument(el)

  const resize = () => {
    el.style.height = 'auto'
    const borderTopWidth = Number.parseInt(style.borderTopWidth, 10)
    const borderBottomWidth = Number.parseInt(style.borderBottomWidth, 10)
    el.style.height = `${el.scrollHeight + borderTopWidth + borderBottomWidth}px`
  }

  el.addEventListener('input', resize)

  const elementPrototype = Object.getPrototypeOf(el)
  const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'value')

  if (descriptor && descriptor.set) {
    // eslint-disable-next-line accessor-pairs
    Object.defineProperty(el, 'value', {
      ...descriptor,
      set() {
        // eslint-disable-next-line prefer-rest-params
        descriptor?.set?.apply(this, arguments as unknown as [unknown])
        resize()
      },
    })
  }

  const resizeObserver = new win.ResizeObserver(() => resize())
  resizeObserver.observe(el)

  const attrObserver = new win.MutationObserver(() => resize())
  attrObserver.observe(el, { attributes: true, attributeFilter: ['rows', 'placeholder'] })

  doc.fonts?.addEventListener('loadingdone', resize)

  return () => {
    el.removeEventListener('input', resize)
    doc.fonts?.removeEventListener('loadingdone', resize)
    resizeObserver.disconnect()
    attrObserver.disconnect()
  }
}
