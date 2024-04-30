import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'
import { DestylerPopperRoot } from '@destyler/popper'

import type { MenuContext } from './root'
import { injectMenuContext, provideMenuContext } from './root'

export const destylerMenuSubProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type DestylerMenuSubProps = ExtractPublicPropTypes<typeof destylerMenuSubProps>

export interface MenuSubContext {
  contentId: string
  triggerId: string
  trigger: Ref<HTMLElement | undefined>
  onTriggerChange: (trigger: HTMLElement | undefined) => void
  parentMenuContext?: MenuContext
}

export const [injectMenuSubContext, provideMenuSubContext] = createContext<MenuSubContext>('DestylerMenuSub')

export const DestylerMenuSub = defineComponent({
  name: 'DestylerMenuSub',
  props: destylerMenuSubProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: false,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const parentMenuContext = injectMenuContext()
    const trigger = ref<HTMLElement>()
    const content = ref<HTMLElement>()

    watchEffect((cleanupFn) => {
      if (parentMenuContext?.open.value === false)
        open.value = false
      cleanupFn(() => (open.value = false))
    })

    provideMenuContext({
      open,
      onOpenChange: (value) => {
        open.value = value
      },
      content,
      onContentChange: (element) => {
        content.value = element
      },
    })

    provideMenuSubContext({
      triggerId: useId(),
      contentId: useId(),
      trigger,
      onTriggerChange: (element) => {
        trigger.value = element
      },
    })
  },
  render() {
    return h(DestylerPopperRoot, null, () => this.$slots.default?.())
  },
})
