import { addDomEvent, contains, getDocument, getEventTarget, getNearestOverflowAncestor, getWindow, isContextMenuEvent, isFocusable, isHTMLElement, raf } from '@destyler/dom'
import { callAll } from '@destyler/utils'
import { getParentWindow, getWindowFrames } from './src/frame-utils'

export interface InteractOutsideHandlers {
  /**
   * Function called when the pointer is pressed down outside the component
   */
  onPointerDownOutside?: ((event: PointerDownOutsideEvent) => void) | undefined
  /**
   * Function called when the focus is moved outside the component
   */
  onFocusOutside?: ((event: FocusOutsideEvent) => void) | undefined
  /**
   * Function called when an interaction happens outside the component
   */
  onInteractOutside?: ((event: InteractOutsideEvent) => void) | undefined
}

export interface InteractOutsideOptions extends InteractOutsideHandlers {
  exclude?: ((target: HTMLElement) => boolean) | undefined
  defer?: boolean | undefined
}

export interface EventDetails<T> {
  originalEvent: T
  contextmenu: boolean
  focusable: boolean
}

const POINTER_OUTSIDE_EVENT = 'pointerdown.outside'
const FOCUS_OUTSIDE_EVENT = 'focus.outside'

export type PointerDownOutsideEvent = CustomEvent<EventDetails<PointerEvent>>

export type FocusOutsideEvent = CustomEvent<EventDetails<FocusEvent>>

export type InteractOutsideEvent = PointerDownOutsideEvent | FocusOutsideEvent

export type MaybeElement = HTMLElement | null | undefined
export type NodeOrFn = MaybeElement | (() => MaybeElement)

function isComposedPathFocusable(composedPath: EventTarget[]) {
  for (const node of composedPath) {
    if (isHTMLElement(node) && isFocusable(node))
      return true
  }
  return false
}

const isPointerEvent = (event: Event): event is PointerEvent => 'clientY' in event

function isEventPointWithin(node: MaybeElement, event: Event) {
  if (!isPointerEvent(event) || !node)
    return false

  const rect = node.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0)
    return false

  return (
    rect.top <= event.clientY
    && event.clientY <= rect.top + rect.height
    && rect.left <= event.clientX
    && event.clientX <= rect.left + rect.width
  )
}

function isPointInRect(rect: { x: number, y: number, width: number, height: number }, point: { x: number, y: number }) {
  return rect.y <= point.y && point.y <= rect.y + rect.height && rect.x <= point.x && point.x <= rect.x + rect.width
}

function isEventWithinScrollbar(event: Event, ancestor: HTMLElement): boolean {
  if (!ancestor || !isPointerEvent(event))
    return false

  const isScrollableY = ancestor.scrollHeight > ancestor.clientHeight
  const onScrollbarY = isScrollableY && event.clientX > ancestor.offsetLeft + ancestor.clientWidth

  const isScrollableX = ancestor.scrollWidth > ancestor.clientWidth
  const onScrollbarX = isScrollableX && event.clientY > ancestor.offsetTop + ancestor.clientHeight

  const rect = {
    x: ancestor.offsetLeft,
    y: ancestor.offsetTop,
    width: ancestor.clientWidth + (isScrollableY ? 16 : 0),
    height: ancestor.clientHeight + (isScrollableX ? 16 : 0),
  }

  const point = {
    x: event.clientX,
    y: event.clientY,
  }

  if (!isPointInRect(rect, point))
    return false

  return onScrollbarY || onScrollbarX
}

function trackInteractOutsideImpl(node: MaybeElement, options: InteractOutsideOptions) {
  const { exclude, onFocusOutside, onPointerDownOutside, onInteractOutside, defer } = options

  if (!node)
    return

  const doc = getDocument(node)
  const win = getWindow(node)
  const frames = getWindowFrames(win)
  const parentWin = getParentWindow(win)

  function isEventOutside(event: Event): boolean {
    const target = getEventTarget(event)
    if (!isHTMLElement(target))
      return false

    // ignore disconnected nodes (removed from DOM)
    if (!target.isConnected)
      return false

    // ignore nodes that are inside the component
    if (contains(node, target))
      return false

    // Ex: password manager selection
    if (isEventPointWithin(node, event))
      return false

    // Ex: page content that is scrollable
    const triggerEl = doc.querySelector(`[aria-controls="${node!.id}"]`)
    if (triggerEl) {
      const triggerAncestor = getNearestOverflowAncestor(triggerEl)
      if (isEventWithinScrollbar(event, triggerAncestor))
        return false
    }

    // Ex: dialog positioner that is scrollable
    const nodeAncestor = getNearestOverflowAncestor(node!)
    if (isEventWithinScrollbar(event, nodeAncestor))
      return false

    // Custom exclude function
    return !exclude?.(target)
  }

  const pointerdownCleanups = new Set<() => void | false>()
  const pendingFrames = new Set<VoidFunction>()
  let disposed = false
  let cleaning = false
  let cleaned = false

  function scheduleOutside(callback: VoidFunction) {
    if (disposed)
      return
    if (!defer) {
      callback()
      return
    }
    const cancel = raf(() => {
      pendingFrames.delete(cancel)
      if (!disposed)
        callback()
    })
    pendingFrames.add(cancel)
  }

  function onPointerDown(event: PointerEvent) {
    if (disposed)
      return
    //
    function handler() {
      const composedPath = event.composedPath?.() ?? [event.target]
      scheduleOutside(() => {
        if (!node || !isEventOutside(event))
          return

        if (onPointerDownOutside || onInteractOutside) {
          const handler = callAll(onPointerDownOutside, onInteractOutside) as EventListener
          node.addEventListener(POINTER_OUTSIDE_EVENT, handler, { once: true })
        }

        fireCustomEvent(node, POINTER_OUTSIDE_EVENT, {
          bubbles: false,
          cancelable: true,
          detail: {
            originalEvent: event,
            contextmenu: isContextMenuEvent(event),
            focusable: isComposedPathFocusable(composedPath),
          },
        })
      })
    }

    if (event.pointerType === 'touch') {
      // flush any pending pointerup events
      pointerdownCleanups.forEach(fn => fn())
      // add a pointerup event listener to the document and all frame documents
      pointerdownCleanups.add(addDomEvent(doc, 'click', handler, { once: true }))
      pointerdownCleanups.add(parentWin.addEventListener('click', handler, { once: true }))
      pointerdownCleanups.add(frames.addEventListener('click', handler, { once: true }))
    }
    else {
      handler()
    }
  }
  const cleanups = new Set<() => void | false>()

  const timer = setTimeout(() => {
    cleanups.add(addDomEvent(doc, 'pointerdown', onPointerDown, true))
    cleanups.add(parentWin.addEventListener('pointerdown', onPointerDown, true))
    cleanups.add(frames.addEventListener('pointerdown', onPointerDown, true))
  }, 0)

  function onFocusin(event: FocusEvent) {
    //
    scheduleOutside(() => {
      if (!node || !isEventOutside(event))
        return

      if (onFocusOutside || onInteractOutside) {
        const handler = callAll(onFocusOutside, onInteractOutside) as EventListener
        node.addEventListener(FOCUS_OUTSIDE_EVENT, handler, { once: true })
      }

      fireCustomEvent(node, FOCUS_OUTSIDE_EVENT, {
        bubbles: false,
        cancelable: true,
        detail: {
          originalEvent: event,
          contextmenu: false,
          focusable: isFocusable(getEventTarget(event)),
        },
      })
    })
  }

  cleanups.add(addDomEvent(doc, 'focusin', onFocusin, true))
  cleanups.add(parentWin.addEventListener('focusin', onFocusin, true))
  cleanups.add(frames.addEventListener('focusin', onFocusin, true))

  return () => {
    if (cleaning || cleaned)
      return
    disposed = true
    cleaning = true
    try {
      pendingFrames.forEach((cancel) => {
        cancel()
        pendingFrames.delete(cancel)
      })
      clearTimeout(timer)
      pointerdownCleanups.forEach((cleanup) => {
        if (cleanup() !== false)
          pointerdownCleanups.delete(cleanup)
      })
      cleanups.forEach((cleanup) => {
        if (cleanup() !== false)
          cleanups.delete(cleanup)
      })
      cleaned = pointerdownCleanups.size === 0 && cleanups.size === 0
    }
    finally {
      cleaning = false
    }
  }
}

export function trackInteractOutside(nodeOrFn: NodeOrFn, options: InteractOutsideOptions) {
  const { defer } = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  cleanups.push(
    func(() => {
      const node = typeof nodeOrFn === 'function' ? nodeOrFn() : nodeOrFn
      cleanups.push(trackInteractOutsideImpl(node, options))
    }),
  )
  return () => {
    cleanups.forEach(fn => fn?.())
  }
}

function fireCustomEvent(el: HTMLElement, type: string, init?: CustomEventInit) {
  const win = el.ownerDocument.defaultView || window
  const event = new win.CustomEvent(type, init)
  return el.dispatchEvent(event)
}
