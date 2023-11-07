import { defineComponent, h, ref } from 'vue'
import type { PopoverInst } from '@destyler/popover'
import { DestylerPopover, destylerPopoverProps } from '@destyler/popover'

export type TooltipInst = PopoverInst

export default defineComponent({
  name: 'DestylerTooltip',
  __popover__: true,
  props: destylerPopoverProps,
  setup() {
    const popoverRef = ref<PopoverInst | null>(null)
    const tooltipExposedMethod: TooltipInst = {
      syncPosition() {
        popoverRef.value!.syncPosition()
      },
      setShow(show: boolean) {
        popoverRef.value!.setShow(show)
      },
    }
    return {
      ...tooltipExposedMethod,
      popoverRef,
    }
  },
  render() {
    return h(DestylerPopover, {
      ...this.$props,
      ref: 'popoverRef',
    },
    this.$slots)
  },
})
