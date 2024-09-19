import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { PopperArrow } from '@destyler/popper'

export const hoverCardArrowProps = {
  ...primitiveProps,
  /**
   * @default svg
   */
  as: {
    ...primitiveProps.as,
    default: 'svg',
  },
  /**
   * The width of the arrow in pixels.
   *
   * @default 10
   */
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  /**
   * The height of the arrow in pixels.
   *
   * @default 5
   */
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
