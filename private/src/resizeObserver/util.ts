import ResizeObserver from 'resize-observer-polyfill'

export type ResizeListener = (element: Element) => void

const elementListeners = new Map<Element, Set<ResizeListener>>()

function onResize(entities: ResizeObserverEntry[]) {
  entities.forEach((entity) => {
    const { target } = entity
    elementListeners.get(target)?.forEach(listener => listener(target))
  })
}

const resizeObserver = new ResizeObserver(onResize)

export function observe(element: Element, callback: ResizeListener) {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Set())
    resizeObserver.observe(element)
  }

  elementListeners.get(element)!.add(callback)
}

export function unobserve(element: Element, callback: ResizeListener) {
  if (elementListeners.has(element))
    elementListeners.get(element)!.delete(callback)
}
