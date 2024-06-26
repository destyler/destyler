import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { destylerMenuLabelProps } from '@destyler/menu'

export const destylerContextMenuLabelProps = {
  ...destylerMenuLabelProps,
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
