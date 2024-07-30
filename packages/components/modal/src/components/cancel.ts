import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DialogClose, dialogCloseProps } from '@destyler/dialog'

import { injectModalContentContext } from './content'

export const modalCancelProps = {
  ...dialogCloseProps,
} as const

export type ModalCancelProps = ExtractPublicPropTypes<typeof modalCancelProps>

export const ModalCancel = defineComponent({
  name: 'DestylerModalCancel',
  props: modalCancelProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const contentContext = injectModalContentContext()
    const { forwardRef, currentElement } = useForwardExpose()

    onMounted(() => {
      contentContext.onCancelElementChange(currentElement.value)
    })

    return {
      forwardRef,
    }
  },
  render() {
    return h(DialogClose, mergeProps(this.$props, {
      ref: this.forwardRef,
    }), () => this.$slots.default?.())
  },
})
