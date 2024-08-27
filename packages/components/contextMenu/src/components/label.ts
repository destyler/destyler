import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuLabel, menuLabelProps } from '@destyler/menu'

export const contextMenuLabelProps = {
  ...menuLabelProps,
} as const

export type ContextMenuLabelProps = ExtractPublicPropTypes<typeof contextMenuLabelProps>

export const ContextMenuLabel = defineComponent({
  name: 'DestylerContextMenuLabel',
  props: contextMenuLabelProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuLabel, this.$props, () => this.$slots.default?.())
  },
})
