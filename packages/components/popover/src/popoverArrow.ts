import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPopperArrow, destylerPopperArrowProps } from '@destyler/popper'

export const destylerPopoverArrowProps = {
  ...destylerPopperArrowProps,
}

export const DestylerPopoverArrow = defineComponent({
  name: 'DestylerPopoverArrow',
  props: destylerPopoverArrowProps,
  render() {
    return h(DestylerPopperArrow, mergeProps(this.$props, {
    }), this.$slots.default?.())
  },
})
