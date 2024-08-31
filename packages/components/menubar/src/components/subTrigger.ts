import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuSubTrigger, menuSubTriggerProps } from '@destyler/menu'

export const menubarSubTriggerProps = {
  ...menuSubTriggerProps,
} as const

export type MenubarSubTriggerProps = ExtractPublicPropTypes<typeof menubarSubTriggerProps>

export const MenubarSubTrigger = defineComponent({
  name: 'DestylerMenubarSubTrigger',
  props: menubarSubTriggerProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuSubTrigger, mergeProps(this.$props, {
      'data-destyler-menubar-subtrigger': '',
    }), () => this.$slots.default?.())
  },
})
