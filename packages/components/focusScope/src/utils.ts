export const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount'
export const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'
export const EVENT_OPTIONS = { bubbles: false, cancelable: true }

type FocusableTarget = HTMLElement | { focus(): void }

export function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (document.activeElement !== previouslyFocusedElement)
      return true
  }
}

export function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container)
  const first = findVisible(candidates, container)
  const last = findVisible(candidates.reverse(), container)
  return [first, last] as const
}

export function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden'
      if (node.disabled || node.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP
      return node.tabIndex >= 0
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

export function findVisible(elements: HTMLElement[], container: HTMLElement) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container }))
      return element
  }
}

export function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden')
    return true
  while (node) {
    if (upTo !== undefined && node === upTo)
      return false
    if (getComputedStyle(node).display === 'none')
      return true
    node = node.parentElement as HTMLElement
  }
  return false
}

export function isSelectableInput(
  element: any,
): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element
}

export function focus(
  element?: FocusableTarget | null,
  { select = false } = {},
) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement
    element.focus({ preventScroll: true })
    if (
      element !== previouslyFocusedElement
      && isSelectableInput(element)
      && select
    )
      element.select()
  }
}
