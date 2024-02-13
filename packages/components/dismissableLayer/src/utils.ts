import { type Ref, nextTick, ref, watchEffect } from 'vue'
import { handleAndDispatchCustomEvent, isClient } from '@destyler/shared'

export type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent
}>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export const DISMISSABLE_LAYER_NAME = 'DismissableLayer'
export const CONTEXT_UPDATE = 'dismissableLayer.update'
export const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside'
export const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside'

function isLayerExist(layerElement: HTMLElement, targetElement: HTMLElement) {
  const targetLayer = targetElement.closest(
    '[data-dismissable-layer]',
  ) as HTMLElement

  const mainLayer = layerElement.querySelector(
    '[data-dismissable-layer]',
  ) as HTMLElement

  const nodeList = Array.from(
    layerElement.ownerDocument.querySelectorAll('[data-dismissable-layer]'),
  )
  if (
    (targetLayer
    && mainLayer === targetLayer)
    || nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer)
  )
    return true
  else return false
}

export function usePointerDownOutside(
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void,
  element?: Ref<HTMLElement | undefined>,
) {
  const ownerDocument: Document
    = element?.value?.ownerDocument ?? globalThis?.document

  const isPointerInsideDOMTree = ref(false)
  const handleClickRef = ref(() => {})

  watchEffect((cleanupFn) => {
    if (!isClient)
      return
    const handlePointerDown = async (event: PointerEvent) => {
      const target = event.target as HTMLElement

      if (!element?.value)
        return

      if (isLayerExist(element.value, target)) {
        isPointerInsideDOMTree.value = false
        return
      }

      if (event.offsetX > target.clientWidth || event.offsetY > target.clientHeight)
        return

      if (event.target && !isPointerInsideDOMTree.value) {
        const eventDetail = { originalEvent: event }

        function handleAndDispatchPointerDownOutsideEvent() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            onPointerDownOutside,
            eventDetail,
          )
        }

        if (event.pointerType === 'touch') {
          ownerDocument.removeEventListener('click', handleClickRef.value)
          handleClickRef.value = handleAndDispatchPointerDownOutsideEvent
          ownerDocument.addEventListener('click', handleClickRef.value, {
            once: true,
          })
        }
        else {
          handleAndDispatchPointerDownOutsideEvent()
        }
      }
      else {
        ownerDocument.removeEventListener('click', handleClickRef.value)
      }
      isPointerInsideDOMTree.value = false
    }

    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener('pointerdown', handlePointerDown)
    }, 0)

    cleanupFn(() => {
      window.clearTimeout(timerId)
      ownerDocument.removeEventListener('pointerdown', handlePointerDown)
      ownerDocument.removeEventListener('click', handleClickRef.value)
    })
  })

  return {
    onPointerDownCapture: () => (isPointerInsideDOMTree.value = true),
  }
}

export function useFocusOutside(
  onFocusOutside?: (event: FocusOutsideEvent) => void,
  element?: Ref<HTMLElement | undefined>,
) {
  const ownerDocument: Document
    = element?.value?.ownerDocument ?? globalThis?.document

  const isFocusInsideDOMTree = ref(false)
  watchEffect((cleanupFn) => {
    if (!isClient)
      return
    const handleFocus = async (event: FocusEvent) => {
      if (!element?.value)
        return

      await nextTick()
      if (isLayerExist(element.value, event.target as HTMLElement))
        return

      if (event.target && !isFocusInsideDOMTree.value) {
        const eventDetail = { originalEvent: event }
        handleAndDispatchCustomEvent(
          FOCUS_OUTSIDE,
          onFocusOutside,
          eventDetail,
        )
      }
    }

    ownerDocument.addEventListener('focusin', handleFocus)

    cleanupFn(() => ownerDocument.removeEventListener('focusin', handleFocus))
  })

  return {
    onFocusCapture: () => (isFocusInsideDOMTree.value = true),
    onBlurCapture: () => (isFocusInsideDOMTree.value = false),
  }
}

export function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE)
  document.dispatchEvent(event)
}
