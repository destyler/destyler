import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator, destylerMenuSeparatorProps } from '@destyler/menu'

export const destylerMenubarSeparatorProps = {
  ...destylerMenuSeparatorProps,
} as const

export type DestylerMenubarSeparatorProps = ExtractPublicPropTypes<typeof destylerMenubarSeparatorProps>

export const DestylerMenubarSeparator = defineComponent({
  name: 'DestylerMenubarSeparator',
  props: destylerMenubarSeparatorProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
