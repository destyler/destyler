import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuSubTrigger, menuSubTriggerProps } from '@destyler/menu'

export const contextMenuSubTriggerProps = {
  ...menuSubTriggerProps,
} as const

export type ContextMenuSubTriggerProps = ExtractPublicPropTypes<typeof contextMenuSubTriggerProps>

export const ContextMenuSubTrigger = defineComponent({
  name: 'DestylerContextMenuSubTrigger',
  props: contextMenuSubTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuSubTrigger, this.$props, () => this.$slots.default?.())
  },
})
