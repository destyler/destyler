import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'

import type { MenuContext } from './root'
import { injectMenuContext, provideMenuContext } from './root'

export const menuSubProps = {
  /**
   * The controlled open state of the menu.
   * Can be used as `v-model:open`.
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type MenuSubProps = ExtractPublicPropTypes<typeof menuSubProps>

export const menuSubEmits = {
  /**
   * Event handler called when the open state of the submenu changes
   */
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
