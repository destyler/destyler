import { addDomEvent, getDocument } from '@destyler/dom'

export function trackEscapeKeydown(node: HTMLElement, fn?: (event: KeyboardEvent) => void) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape')
      return
    if (event.isComposing)
      return
    fn?.(event)
  }

  return addDomEvent(getDocument(node), 'keydown', handleKeyDown, { capture: true })
}
