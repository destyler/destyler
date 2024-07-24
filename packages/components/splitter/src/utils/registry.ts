import type { Direction, ResizeEvent } from '../types'
import { resetGlobalCursorStyle, setGlobalCursorStyle } from './style'
import { getResizeEventCoordinates } from './events'
import { intersects } from './rects'
import { compare } from './stackingOrder'

export type ResizeHandlerAction = 'down' | 'move' | 'up'
export type SetResizeHandlerState = (
  action: ResizeHandlerAction,
  isActive: boolean,
  event: ResizeEvent
) => void

export interface PointerHitAreaMargins {
  coarse: number
  fine: number
}

export interface ResizeHandlerData {
  direction: Direction
  element: HTMLElement
  hitAreaMargins: PointerHitAreaMargins
  setResizeHandlerState: SetResizeHandlerState
}

export const EXCEEDED_HORIZONTAL_MIN = 0b0001
export const EXCEEDED_HORIZONTAL_MAX = 0b0010
export const EXCEEDED_VERTICAL_MIN = 0b0100
export const EXCEEDED_VERTICAL_MAX = 0b1000

function getInputType(): 'coarse' | 'fine' | undefined {
  if (typeof matchMedia === 'function')
    return matchMedia('(pointer:coarse)').matches ? 'coarse' : 'fine'
}

const isCoarsePointer = getInputType() === 'coarse'

const intersectingHandles: ResizeHandlerData[] = []
let isPointerDown = false
const ownerDocumentCounts: Map<Document, number> = new Map()
const panelConstraintFlags: Map<string, number> = new Map()

const registeredResizeHandlers = new Set<ResizeHandlerData>()

export function registerResizeHandle(
  resizeHandleId: string,
  element: HTMLElement,
  direction: Direction,
  hitAreaMargins: PointerHitAreaMargins,
  setResizeHandlerState: SetResizeHandlerState,
) {
  const { ownerDocument } = element

  const data: ResizeHandlerData = {
    direction,
    element,
    hitAreaMargins,
    setResizeHandlerState,
  }

  const count = ownerDocumentCounts.get(ownerDocument) ?? 0
  ownerDocumentCounts.set(ownerDocument, count + 1)

  registeredResizeHandlers.add(data)

  updateListeners()

  return function unregisterResizeHandle() {
    panelConstraintFlags.delete(resizeHandleId)
    registeredResizeHandlers.delete(data)

    const count = ownerDocumentCounts.get(ownerDocument) ?? 1
    ownerDocumentCounts.set(ownerDocument, count - 1)

    updateListeners()

    if (count === 1)
      ownerDocumentCounts.delete(ownerDocument)
  }
}

function handlePointerDown(event: ResizeEvent) {
  const { target } = event
  const { x, y } = getResizeEventCoordinates(event)

  isPointerDown = true

  recalculateIntersectingHandles({ target, x, y })
  updateListeners()

  if (intersectingHandles.length > 0) {
    updateResizeHandlerStates('down', event)

    event.preventDefault()
  }
}

function handlePointerMove(event: ResizeEvent) {
  const { x, y } = getResizeEventCoordinates(event)

  if (!isPointerDown) {
    const { target } = event

    recalculateIntersectingHandles({ target, x, y })
  }

  updateResizeHandlerStates('move', event)

  updateCursor()

  if (intersectingHandles.length > 0)
    event.preventDefault()
}

function handlePointerUp(event: ResizeEvent) {
  const { target } = event
  const { x, y } = getResizeEventCoordinates(event)

  panelConstraintFlags.clear()
  isPointerDown = false

  if (intersectingHandles.length > 0)
    event.preventDefault()

  updateResizeHandlerStates('up', event)
  recalculateIntersectingHandles({ target, x, y })
  updateCursor()

  updateListeners()
}

function recalculateIntersectingHandles({
  target,
  x,
  y,
}: {
  target: EventTarget | null
  x: number
  y: number
}) {
  intersectingHandles.splice(0)

  let targetElement: HTMLElement | null = null
  if (target instanceof HTMLElement)
    targetElement = target

  registeredResizeHandlers.forEach((data) => {
    const { element: dragHandleElement, hitAreaMargins } = data

    const dragHandleRect = dragHandleElement.getBoundingClientRect()
    const { bottom, left, right, top } = dragHandleRect

    const margin = isCoarsePointer
      ? hitAreaMargins.coarse
      : hitAreaMargins.fine

    const eventIntersects
      = x >= left - margin
      && x <= right + margin
      && y >= top - margin
      && y <= bottom + margin

    if (eventIntersects) {
      if (
        targetElement !== null
        && dragHandleElement !== targetElement
        && !dragHandleElement.contains(targetElement)
        && !targetElement.contains(dragHandleElement)
        && compare(targetElement, dragHandleElement) > 0
      ) {
        let currentElement: HTMLElement | null = targetElement
        let didIntersect = false
        while (currentElement) {
          if (currentElement.contains(dragHandleElement)) {
            break
          }
          else if (
            intersects(
              currentElement.getBoundingClientRect(),
              dragHandleRect,
              true,
            )
          ) {
            didIntersect = true
            break
          }

          currentElement = currentElement.parentElement
        }

        if (didIntersect)
          return
      }

      intersectingHandles.push(data)
    }
  })
}

export function reportConstraintsViolation(
  resizeHandleId: string,
  flag: number,
) {
  panelConstraintFlags.set(resizeHandleId, flag)
}

function updateCursor() {
  let intersectsHorizontal = false
  let intersectsVertical = false

  intersectingHandles.forEach((data) => {
    const { direction } = data

    if (direction === 'horizontal')
      intersectsHorizontal = true
    else
      intersectsVertical = true
  })

  let constraintFlags = 0
  panelConstraintFlags.forEach((flag) => {
    constraintFlags |= flag
  })

  if (intersectsHorizontal && intersectsVertical)
    setGlobalCursorStyle('intersection', constraintFlags)
  else if (intersectsHorizontal)
    setGlobalCursorStyle('horizontal', constraintFlags)
  else if (intersectsVertical)
    setGlobalCursorStyle('vertical', constraintFlags)
  else
    resetGlobalCursorStyle()
}

function updateListeners() {
  ownerDocumentCounts.forEach((_, ownerDocument) => {
    const { body } = ownerDocument

    body.removeEventListener('contextmenu', handlePointerUp)
    body.removeEventListener('mousedown', handlePointerDown)
    body.removeEventListener('mouseleave', handlePointerMove)
    body.removeEventListener('mousemove', handlePointerMove)
    body.removeEventListener('touchmove', handlePointerMove)
    body.removeEventListener('touchstart', handlePointerDown)
  })

  window.removeEventListener('mouseup', handlePointerUp)
  window.removeEventListener('touchcancel', handlePointerUp)
  window.removeEventListener('touchend', handlePointerUp)

  if (registeredResizeHandlers.size > 0) {
    if (isPointerDown) {
      if (intersectingHandles.length > 0) {
        ownerDocumentCounts.forEach((count, ownerDocument) => {
          const { body } = ownerDocument

          if (count > 0) {
            body.addEventListener('contextmenu', handlePointerUp)
            body.addEventListener('mouseleave', handlePointerMove)
            body.addEventListener('mousemove', handlePointerMove)
            body.addEventListener('touchmove', handlePointerMove, {
              passive: false,
            })
          }
        })
      }

      window.addEventListener('mouseup', handlePointerUp)
      window.addEventListener('touchcancel', handlePointerUp)
      window.addEventListener('touchend', handlePointerUp)
    }
    else {
      ownerDocumentCounts.forEach((count, ownerDocument) => {
        const { body } = ownerDocument

        if (count > 0) {
          body.addEventListener('mousedown', handlePointerDown)
          body.addEventListener('mousemove', handlePointerMove)
          body.addEventListener('touchmove', handlePointerMove, {
            passive: false,
          })
          body.addEventListener('touchstart', handlePointerDown)
        }
      })
    }
  }
}

function updateResizeHandlerStates(
  action: ResizeHandlerAction,
  event: ResizeEvent,
) {
  registeredResizeHandlers.forEach((data) => {
    const { setResizeHandlerState } = data

    const isActive = intersectingHandles.includes(data)

    setResizeHandlerState(action, isActive, event)
  })
}
