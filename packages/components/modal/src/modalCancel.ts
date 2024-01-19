import type { Component,PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import { DestylerDialogClose } from '@destyler/dialog'
import { useCustomElement } from '@destyler/composition'
import type { AsTag } from '@destyler/primitive'
import { destylerPrimitiveProp } from '@destyler/primitive'

import { injectAlertDialogContentContext } from './modalContent'

export const destylerModalCancelProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}

export const DestylerModalCancel = defineComponent({
  name: 'DestylerModalCancel',
  props: destylerModalCancelProps,
  setup() {
    const contentContext = injectAlertDialogContentContext()
    const { customElement, currentElement } = useCustomElement()

    onMounted(() => {
      contentContext.onCancelElementChange(currentElement.value)
    })

    return {
      customElement,
    }
  },
  render() {
    return h(DestylerDialogClose, mergeProps(this.$props, {
      ref: 'customElement',
    }), this.$slots.default?.())
  },
})
