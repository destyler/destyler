import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerContextMenuLabelProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerContextMenuLabelProps = ExtractPublicPropTypes<typeof destylerContextMenuLabelProps>

export const DestylerContextMenuLabel = defineComponent({
  name: 'DestylerContextMenuLabel',
  props: destylerContextMenuLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h('div', this.$props, () => this.$slots.default?.())
  },
})
