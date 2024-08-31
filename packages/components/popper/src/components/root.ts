import type { Ref } from 'vue'
import { defineComponent, ref } from 'vue'
import type { Measurable } from '@destyler/shared'
import { createContext } from '@destyler/shared'

interface PopperRootContext {
  anchor: Ref<Measurable | HTMLElement | undefined>
  onAnchorChange: (element: Measurable | HTMLElement | undefined) => void
}

export const [injectPopperRootContext, providePopperRootContext] = createContext<PopperRootContext>('DestylerPopperRoot')

export const PopperRoot = defineComponent({
  name: 'PopperRoot',

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
