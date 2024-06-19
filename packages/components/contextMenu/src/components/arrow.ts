import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuArrow } from '@destyler/menu'

export const destylerContextMenuArrowProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'svg',
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
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
