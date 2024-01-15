import { isClient } from '@destyler/shared'
import { watchEffect } from 'vue'

/** Number of components which have requested interest to have focus guards */
let count = 0

/**
 * Injects a pair of focus guards at the edges of the whole DOM tree
 * to ensure `focusin` & `focusout` events can be caught consistently.
 */
export function useFocusGuards() {
  watchEffect((cleanupFn) => {
    if (!isClient)
      return
    const edgeGuards = document.querySelectorAll('[data-destyler-focus-guard]')
    document.body.insertAdjacentElement(
      'afterbegin',
      edgeGuards[0] ?? createFocusGuard(),
    )
    document.body.insertAdjacentElement(
      'beforeend',
      edgeGuards[1] ?? createFocusGuard(),
    )
    count++

    cleanupFn(() => {
      if (count === 1) {
        document
          .querySelectorAll('[data-destyler-focus-guard]')
          .forEach(node => node.remove())
      }
      count--
    })
  })
}

function createFocusGuard() {
  const element = document.createElement('span')
  element.setAttribute('data-destyler-focus-guard', '')
  element.tabIndex = 0
  element.style.cssText
    = 'outline: none; opacity: 0; position: fixed; pointer-events: none'
  return element
}
