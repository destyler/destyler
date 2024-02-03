import { unrefElement } from '@destyler/shared'
import { type ComponentPublicInstance, computed, getCurrentInstance, ref } from 'vue'

export function useForwardExpose() {
  const instance = getCurrentInstance()!

  const currentRef = ref<Element | ComponentPublicInstance | null>()
  const currentElement = computed<HTMLElement>(() => {
    // @ts-expect-error ignore ts error
    return ['#text', '#comment'].includes(currentRef.value?.$el.nodeName) ? currentRef.value?.$el.nextElementSibling : unrefElement(currentRef)
  })

  const localExpose: Record<string, any> | null = Object.assign({}, instance.exposed)
  const ret: Record<string, any> = {}

  // retrieve props for current instance
  for (const key in instance.props) {
    Object.defineProperty(ret, key, {
      enumerable: true,
      configurable: true,
      get: () => instance.props[key],
    })
  }

  if (Object.keys(localExpose).length > 0) {
    for (const key in localExpose) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        configurable: true,
        get: () => localExpose![key],
      })
    }
  }

  Object.defineProperty(ret, '$el', {
    enumerable: true,
    configurable: true,
    get: () => instance.vnode.el,
  })
  instance.exposed = ret

  function forwardRef(ref: Element | ComponentPublicInstance | null) {
    currentRef.value = ref

    if (ref instanceof Element || !ref)
      return

    // retrieve the forwarded element
    Object.defineProperty(ret, '$el', {
      enumerable: true,
      configurable: true,
      get: () => ref.$el,
    })

    instance.exposed = ret
  }

  return { forwardRef, currentRef, currentElement }
}
