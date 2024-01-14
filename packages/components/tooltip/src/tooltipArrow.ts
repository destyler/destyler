import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPopperArrow } from '@destyler/popper'

export const destylerTooltipArrowProps = {
  ...destylerPrimitiveProps,
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
}

export const DestylerTooltipArrow = defineComponent({
  name: 'DestylerTooltipArrow',
  props: destylerTooltipArrowProps,
  render() {
    return h(DestylerPopperArrow, {
      ...mergeProps(this.$props),
    }, this.$slots.default?.())
  },
})
