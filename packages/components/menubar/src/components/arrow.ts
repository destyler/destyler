import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuArrow, destylerMenuArrowProps } from '@destyler/menu'

export const destylerMenubarArrowProps = {
  ...destylerMenuArrowProps,
} as const

export type DestylerMenubarArrowProps = ExtractPublicPropTypes<typeof destylerMenubarArrowProps>

export const DestylerMenubarArrow = defineComponent({
  name: 'DestylerMenubarArrow',
  props: destylerMenubarArrowProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuArrow, this.$props, () => this.$slots.default?.())
  },
})
