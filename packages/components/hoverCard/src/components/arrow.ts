import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { PopperArrow } from '@destyler/popper'

export const hoverCardArrowProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
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

export type HoverCardArrowProps = ExtractPublicPropTypes<typeof hoverCardArrowProps>

export const HoverCardArrow = defineComponent({
  name: 'DestylerHoverCardArrow',
  props: hoverCardArrowProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(PopperArrow, this.$props, () => this.$slots.default?.())
  },
})
