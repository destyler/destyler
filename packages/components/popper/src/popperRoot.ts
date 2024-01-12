import type { Ref } from 'vue'
import { defineComponent, ref } from 'vue'
import { createContext } from '@destyler/shared'

export interface Measurable {
  getBoundingClientRect(): DOMRect
}

interface PopperRootContext {
  anchor: Ref<Measurable | HTMLElement | undefined>
  onAnchorChange(element: Measurable | HTMLElement | undefined): void
}

export const [injectPopperRootContext, providePopperRootContext]
  = createContext<PopperRootContext>('DestylerPopperRoot')

export const DestylerPopperRoot = defineComponent({
  name: 'DestylerPopperRoot',
  setup() {
    const anchor = ref<Measurable | HTMLElement>()

    providePopperRootContext({
      anchor,
      onAnchorChange: element => anchor.value = element,
    })
  },
  render() {
    return this.$slots.default?.()
  },
})
