import { getDocument, getWindow } from '@destyler/dom'

export interface WaitOptions {
  timeout: number
  rootNode?: Document | ShadowRoot | undefined
}

type WaitForPromiseReturn<T> = [Promise<T>, () => void]

function waitForPromise<T>(
  promise: Promise<T>,
  controller: AbortController,
  timeout: number,
  cleanup: VoidFunction,
): WaitForPromiseReturn<T> {
  const { signal } = controller

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    let settled = false
    let timeoutId: ReturnType<typeof setTimeout>
    let onAbort: VoidFunction
    const finish = (callback: VoidFunction) => {
      if (settled)
        return
      settled = true
      clearTimeout(timeoutId)
      signal.removeEventListener('abort', onAbort)
      cleanup()
      callback()
    }
    onAbort = () => finish(() => reject(new Error('Promise aborted')))
    timeoutId = setTimeout(() => {
      finish(() => reject(new Error(`Timeout of ${timeout}ms exceeded`)))
    }, timeout)

    signal.addEventListener('abort', onAbort)
    promise.then(
      result => finish(() => resolve(result)),
      error => finish(() => reject(error)),
    )
  })

  return [wrappedPromise, () => controller.abort()]
}

export function waitForElement(target: () => HTMLElement, options: WaitOptions): WaitForPromiseReturn<HTMLElement> {
  const { timeout, rootNode } = options

  const win = getWindow(rootNode)
  const doc = getDocument(rootNode)
  const controller = new win.AbortController()
  let cleanup: VoidFunction = () => {}

  return waitForPromise(
    new Promise<HTMLElement>((resolve) => {
      const el = target()

      if (el) {
        resolve(el)
        return
      }

      const observer = new win.MutationObserver(() => {
        const el = target()

        if (el) {
          resolve(el)
        }
      })

      cleanup = () => observer.disconnect()
      observer.observe(rootNode ?? doc.body, {
        childList: true,
        subtree: true,
      })
    }),
    controller,
    timeout,
    () => cleanup(),
  )
}

type EditableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function waitForElementValue(
  target: () => EditableElement | null,
  value: string,
  options: WaitOptions,
): WaitForPromiseReturn<void> {
  const { timeout, rootNode } = options

  const win = getWindow(rootNode)
  const controller = new win.AbortController()
  let cleanup: VoidFunction = () => {}

  return waitForPromise(
    new Promise<void>((resolve) => {
      const el = target()
      if (!el)
        return

      if (el.value === value) {
        resolve()
        return
      }

      const checkValue = () => {
        if (el.value === value) {
          resolve()
        }
      }

      cleanup = () => el.removeEventListener('input', checkValue)
      el.addEventListener('input', checkValue, { signal: controller.signal })
    }),
    controller,
    timeout,
    () => cleanup(),
  )
}
