import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useId } from '@destyler/composition'
import { DestylerMenuRoot } from '@destyler/menu'

import { injectMenubarRootContext } from './root'

export const destylerMenubarMenuProps = {
  value: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
  },
} as const

export type DestylerMenubarMenuProps = ExtractPublicPropTypes<typeof destylerMenubarMenuProps>

export interface MenubarMenuContext {
  value: string
  triggerId: string
  triggerElement: Ref<HTMLElement | undefined>
  contentId: string
  wasKeyboardTriggerOpenRef: Ref<boolean>
}

export const [injectMenubarMenuContext, provideMenubarMenuContext] = createContext<MenubarMenuContext>('DestylerMenubarMenu')

export const DestylerMenubarMenu = defineComponent({
  name: 'DestylerMenubarMenu',
  props: destylerMenubarMenuProps,
  setup(props) {
    const value = props.value ?? useId()
    const rootContext = injectMenubarRootContext()
    useForwardExpose()

    const triggerElement = ref<HTMLElement>()
    const wasKeyboardTriggerOpenRef = ref(false)

    const open = computed(() => {
      return rootContext.modelValue.value === value
    })

    watch(open, () => {
      if (!open.value)
        wasKeyboardTriggerOpenRef.value = false
    })

    provideMenubarMenuContext({
      value,
      triggerElement,
      triggerId: value,
      contentId: useId(),
      wasKeyboardTriggerOpenRef,
    })

    return {
      value,
      open,
      rootContext,
    }
  },
  render() {
    return h(DestylerMenuRoot, {
      'open': this.open,
      'modal': false,
      'dir': this.rootContext.dir.value,
      'onUpdate:open': (value: boolean) => {
        if (!value)
          this.rootContext.onMenuClose()
      },
    }, () => this.$slots.default?.())
  },
})
