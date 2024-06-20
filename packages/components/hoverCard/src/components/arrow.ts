import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperArrow } from '@destyler/popper'

export const destylerHoverCardArrowProps = {
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

export type DestylerHoverCardArrowProps = ExtractPublicPropTypes<typeof destylerHoverCardArrowProps>

export const DestylerHoverCardArrow = defineComponent({
  name: 'DestylerHoverCardArrow',
  props: destylerHoverCardArrowProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerPopperArrow, this.$props, () => this.$slots.default?.())
  },
})
