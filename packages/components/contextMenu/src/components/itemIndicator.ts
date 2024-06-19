import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuItemIndicator } from '@destyler/menu'

export const destylerContextMenuItemIndicatorProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerContextMenuItemIndicatorProps = ExtractPublicPropTypes<typeof destylerContextMenuItemIndicatorProps>

export const DestylerContextMenuItemIndicator = defineComponent({
  name: 'DestylerContextMenuItemIndicator',
  props: destylerContextMenuItemIndicatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
