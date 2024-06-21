import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerPopperArrow, destylerPopperArrowProps } from '@destyler/popper'

export const destylerMenuArrowProps = {
  ...destylerPopperArrowProps,
} as const

export type DestylerMenuArrowProps = ExtractPublicPropTypes<typeof destylerMenuArrowProps>

export const DestylerMenuArrow = defineComponent({
  name: 'DestylerMenuArrow',
  props: destylerMenuArrowProps,
  render() {
    return h(DestylerPopperArrow, this.$props, () => this.$slots.default?.())
  },
})
