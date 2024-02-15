export function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

export function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

export function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}

export const EVENT_ROOT_CONTENT_DISMISS = 'navigationMenu.rootContentDismiss'

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

export function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocusedElement = document.activeElement
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement)
      return true
    candidate.focus()
    return document.activeElement !== previouslyFocusedElement
  })
}

export function removeFromTabOrder(candidates: HTMLElement[]) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute('tabindex') || ''
    candidate.setAttribute('tabindex', '-1')
  })
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex as string
      candidate.setAttribute('tabindex', prevTabIndex)
    })
  }
}
