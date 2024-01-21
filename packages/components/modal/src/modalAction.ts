import { defineComponent, h, mergeProps } from 'vue'

import { DestylerModalCancel, destylerModalCancelProps } from './modalCancel'

export const destylerModalActionProps = {
  ...destylerModalCancelProps,
}

export const DestylerModalAction = defineComponent({
  name: 'DestylerModalAction',
  props: destylerModalActionProps,
  render() {
    return h(DestylerModalCancel, mergeProps(this.$props), this.$slots.default?.())
  },
})
