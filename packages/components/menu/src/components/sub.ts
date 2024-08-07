import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'

import type { MenuContext } from './root'
import { injectMenuContext, provideMenuContext } from './root'

export const menuSubProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type MenuSubProps = ExtractPublicPropTypes<typeof menuSubProps>

export const menuSubEmits = {
  'update:open': (_open: boolean) => true,
}

export interface MenuSubContext {
  contentId: string
  triggerId: string
  trigger: Ref<HTMLElement | undefined>
  onTriggerChange: (trigger: HTMLElement | undefined) => void
  parentMenuContext?: MenuContext
}

export const [injectMenuSubContext, provideMenuSubContext] = createContext<MenuSubContext>('DestylerMenuSub')

export const MenuSub = defineComponent({
  name: 'DestylerMenuSub',
  props: menuSubProps,
  emits: menuSubEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
    return h(PopperRoot, null, () => this.$slots.default?.())
  },
})
