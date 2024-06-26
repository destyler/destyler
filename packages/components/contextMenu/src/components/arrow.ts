import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuArrow, destylerMenuArrowProps } from '@destyler/menu'

export const destylerContextMenuArrowProps = {
  ...destylerMenuArrowProps,
} as const

export type DestylerContextMenuArrowProps = ExtractPublicPropTypes<typeof destylerContextMenuArrowProps>

export const DestylerContextMenuArrow = defineComponent({
  name: 'DestylerContextMenuArrow',
  props: destylerContextMenuArrowProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuArrow, this.$props, () => this.$slots.default?.())
  },
})
