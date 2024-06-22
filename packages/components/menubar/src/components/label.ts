import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuLabel, destylerMenuLabelProps } from '@destyler/menu'

export const destylerMenubarLabelProps = {
  ...destylerMenuLabelProps,
} as const

export type DestylerMenubarLabelProps = ExtractPublicPropTypes<typeof destylerMenubarLabelProps>

export const DestylerMenubarLabel = defineComponent({
  name: 'DestylerMenubarLabel',
  props: destylerMenubarLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuLabel, this.$props, () => this.$slots.default?.())
  },
})
